const express = require('express');

const path = require('path');

const cors = require('cors');

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const MongoDBStore = require("connect-mongo");
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const User = require('./models/user');
const Technician = require('./models/technician');

const Userroutes = require('./routes/userroutes');
const Technicianroutes = require('./routes/technicianroutes.js');
const Adminroutes = require('./routes/adminroutes');
const Errorformroutes = require('./routes/errorformroutes');
const Middlewareroutes = require('./middleware');
const dotenv = require('dotenv');

mongoose.connect('mongodb://localhost:27017/erpdevelopment', {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
const store = MongoDBStore.create({
  mongoUrl: 'mongodb://localhost:27017/erpdevelopment',
  collectionName: 'sessions',
});
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const sessionConfig = {
  name: "session",
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'Lax',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
// Replace existing passport configuration with:
passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    type: user instanceof Technician ? 'technician' : 'user'
  });
});

passport.deserializeUser(async (obj, done) => {
  try {
    let user;
    if (obj.type === 'technician') {
      user = await Technician.findById(obj.id);
    } else {
      user = await User.findById(obj.id);
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

app.use('/api/user', Userroutes);
app.use('/api/technician', Technicianroutes)
app.use('/api/admin', Adminroutes);
app.use('/api/errorform', Errorformroutes);
app.use('/api', Middlewareroutes);

app.use(express.static(path.join(__dirname, '../frontend/dist')))
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')));

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
