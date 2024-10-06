// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport.js'); // Correct Import of Passport Module
const session = require('express-session'); // For session handling
const MongoStore = require('connect-mongo'); // For persistent session storage

const authRoutes = require('./routes/Auth.js'); // Ensure correct casing
const taskRoutes = require('./routes/tasks.js'); // Import task routes

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://trello-clone-steel-three.vercel.app/'], // Update with your frontend domain
    credentials: true, // Enable if you need to send cookies with requests
  })
);

// Session Middleware (required for Passport)
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      '34392719b4eef1d421dd77db4a9071322dcfa6798c15da1a58b7e1c29a0e090128934d050db8171b5ca016c330a2e0a07bba48faf3adea705d1e6157743bd815',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
const configurePassport = require('./config/passport.js'); // Import the configuration function
configurePassport(passport); // Pass Passport to the configuration function

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, // No longer needed in Mongoose 6+
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));





// // server.js
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const passport = require('./config/passport.js'); // Import Passport
// const session = require('express-session'); // For session handling

// const authRoutes = require('./routes/Auth.js'); // Ensure correct casing
// const taskRoutes = require('./routes/tasks.js'); // Import task routes


// const app = express();

// // Middleware
// app.use(express.json());
// app.use(
//   cors({
//     origin: ['http://localhost:3000', 'https://trello-clone-steel-three.vercel.app/'], // Update with your frontend domain
//     credentials: true, // Enable if you need to send cookies with requests
//   })
// );

// // Session Middleware (required for Passport)
// app.use(
//   session({
//     secret:
//       process.env.SESSION_SECRET ||
//       '34392719b4eef1d421dd77db4a9071322dcfa6798c15da1a58b7e1c29a0e090128934d050db8171b5ca016c330a2e0a07bba48faf3adea705d1e6157743bd815',
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// // Initialize Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // Passport Config
// const configurePassport = require('./config/passport.js'); // Import the configuration function
// configurePassport(passport); // Pass Passport to the configuration function

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);

// // Database Connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     // useCreateIndex: true, // No longer needed in Mongoose 6+
//   })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log(err));

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
