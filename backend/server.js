require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
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
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

app.use('/', require('./routes/views'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks',require('./routes/tasks'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Management API' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(`Mongo connected.`);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });

