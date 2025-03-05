const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const MongoDBStore = require("connect-mongo");
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const User = require('./models/user.js');
const Technician = require('./models/technician.js');
const Userroutes = require('./routes/userroutes.js');
const Technicianroutes = require('./routes/technicianroutes.js');
const Adminroutes = require('./routes/adminroutes.js');
const Errorformroutes = require('./routes/errorformroutes.js');
const Middlewareroutes = require('./middleware.js');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const store = MongoDBStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'sessions',
});
const sessionConfig = {
  name: "session",
  secret: process.env.SESSION_SECRET,
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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')));
}
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//some changes