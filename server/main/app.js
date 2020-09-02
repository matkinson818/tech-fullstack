const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const { adminBro, router } = require('./admin')


// Load env variables
dotenv.config({ path: './config/config.env' });

// Connecting to the MongoDB database
mongoose
.connect(process.env.CONN_URI, 
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, 
      'useCreateIndex': true
    })
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

mongoose.Promise = global.Promise;

// Route files
const blogs = require('../routes/blogs');

//Setup express app
const app = express();

//Body Parser
app.use(express.json());

// Use logger middleware
if(process.env.NODE_ENV == 'development') {
    app.use(morgan('tiny'));
};

// Mount routes
app.use('/api/v1/blogs', blogs);
app.use('/admin', require('./admin'));

// Setting up a port variable
const PORT = process.env.PORT || 5000;

//listen on port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))

