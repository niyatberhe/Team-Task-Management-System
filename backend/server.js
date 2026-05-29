require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');
const {engine} = require('express-handlebars');

const app = express();
app.engine('.hbs', engine({
    extname: '.hbs', 
    defaultLayout: 'main', 
    helpers: {
        eq: (a, b) => a === b,
        statusClass: (status) => {
            if (status === 'completed') return 'bg-green-100 text-green-700';
            if (status === 'in-progress') return 'bg-yellow-100 text-yellow-700';
            
            return 'bg-gray-100 text-gray-700';
        }
    }}
));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use((req, res, next) => {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = decoded;
  } catch (err) {
    res.locals.user = null;
  }

  next();
});
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err);
    res.status(500).send('Database connection error');
  }
});

app.use('/', require('./routes/views'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks',require('./routes/tasks'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Management API' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  }).catch(err => {
    console.error('Failed to connect DB on startup:', err);
  });
}

module.exports = app;
