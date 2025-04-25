const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoDBStore = require('connect-mongo');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const User = require('./models/user.js');
const Technician = require('./models/technician.js');
const Userroutes = require('./routes/userroutes.js');
const Technicianroutes = require('./routes/technicianroutes.js');
const Errorformroutes = require('./routes/errorformroutes.js');
const Cscroutes = require('./routes/cscroutes.js');
const Middlewareroutes = require('./middleware.js');
const { srfForms, Product } = require("./models/db");
const dotenv = require('dotenv');
const razorpay = require('razorpay');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
const result = dotenv.config();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const store = MongoDBStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'sessions',
});
store.on('error', function (error) {
  console.error('Session store error:', error);
});

const sessionConfig = {
  name: 'session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    httpOnly: true,
    sameSite: 'Lax',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  },
    async (req, username, password, done) => {
      try {
        const userType = req.body.usertype;
        const user = await User.findOne({ username: username, usertype: userType });
        if (!user) {
          return done(null, false, { message: 'Invalid username or user type.' });
        }
        user.authenticate(password, (err, authenticatedUser, errorMsg) => {
          if (err) return done(err);
          if (!authenticatedUser) {
            return done(null, false, { message: 'Invalid password.' });
          }
          return done(null, authenticatedUser);
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    type: user.usertype,
  });
});

passport.deserializeUser(async (userData, done) => {
  try {
    const user = await User.findById(userData.id);
    if (!user) {
      return done(new Error('User not found'));
    }
    if (user.usertype !== userData.type) {
      return done(new Error('User type mismatch'));
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8085',
    'https://erpdevelopment.onrender.com'],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));

app.use('/api/user', Userroutes);
app.use('/api/technician', Technicianroutes);
app.use('/api/errorform', Errorformroutes);
app.use('/api/csc', Cscroutes);
app.use('/api', Middlewareroutes);

app.post("/api/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // Extract only the fields that Razorpay needs and separate productId
    const { productId, amount, currency, receipt } = req.body;
    // Build options for Razorpay orders.create
    const options = { amount, currency, receipt };

    // Create the order with Razorpay using the correct options
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).send("Error creating Razorpay order");
    }

    // Update the product with the Razorpay order ID if productId exists
    if (productId) {
      await Product.findByIdAndUpdate(productId, { orderId: order.id });
    }

    res.json(order);
  } catch (err) {
    console.error("Error in /order route:", err);
    res.status(500).send("Error");
  }
});


app.post("/api/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");

  if (digest === razorpay_signature) {
    try {
      const product = await Product.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { $set: { ispaymentDone: true } },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ msg: "Product not found for the given order" });
      }

      res.json({
        msg: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        product
      });
    } catch (error) {
      console.error("Error updating product payment status:", error);
      return res.status(500).json({ msg: "Server error while updating payment status" });
    }
  } else {
    return res.status(400).json({ success: false, msg: "Payment validation failed" });
  }
});

// Replace your catch-all route with this middleware
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Use middleware instead of route pattern
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      return res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
    }
    next();
  });
}

// Default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (req.accepts('html')) {
    res.status(err.status || 500).sendFile(path.join(__dirname, '../frontend/dist/error.html'));
  } else {
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal Server Error',
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} + frontend ${frontendUrl}`);
});