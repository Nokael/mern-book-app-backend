const mongoose = require('mongoose');

const dbConnect = () => {

    console.log('MONGODB_URL:', process.env.MONGODB_URL); // Check if the value is printed correctly
    // connecting db
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('database connected successfully'))
    .catch(err => console.log(err))

// , {
//     useFindAndModify: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useNewUrlParser: true
// })

}

module.exports = dbConnect;