const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const dbConnect = require('./config/dbConnect');
const path = require('path'); // Add this line to import the path module
const userRoutes = require('./routes/userRoutes');
const bookRouter = require('./routes/bookRouter')
const error = require('./middleWares/errorMiddleWares')

const app = express();

// environment keys
dotenv.config();
// connecting db
dbConnect(); 

//passing body data
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000", "https://mern-stack-books-app-a0na.onrender.com"]
}));

// Serve static files from the build directory
app.use(express.static(path.resolve(__dirname, 'frontend/build')));


//routes
//user routes
app.use('/api/users', userRoutes);
//book routes
app.use('/api/books', bookRouter);


// Catch-all route for serving the React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/build', 'index.html'));
});
// Catch-all route for serving the React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});
// error middleware handler
app.use(error.errorMiddleware);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is live and running on ${PORT}`);
});

