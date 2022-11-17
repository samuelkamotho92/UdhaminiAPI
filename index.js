const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const scholarshipRoute = require('./routes/scholarship');


//middlewares
dotenv.config();
app.use(express.json()); //app is able to send JSON requests
app.use("/images", express.static(path.join(__dirname, '/images'))); //using path lib to acess images in folders
app.use(cors());
//connect to mongodb
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("connected to mongodb"))
    .catch((err) => console.log(err));

//storage to store images using multer library
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
});
//upload file
const upload = multer({ storage: storage });
//set upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.send("File has been Uploaded");
});

//define my routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/scholarship", scholarshipRoute); //api/scholarship/register

//server running port
app.listen(process.env.PORT || 5000, () => {
    console.log('Server running');
});
    //Routes for scholarship
//[POST] api/scholarship/register
//[PUT] api/scholarship/:id
//[DELETE] api/scholarship/:id
//[GET] api/scholarship/:id
//[GET] api/scholarship/all

    //Routes for Auth
//[POST] api/auth/register
//[POST] api/auth/login

    //Routes for users
//[GET] api/users/all
//[PUT] api/users/:id
//[DELETE] api/users/:id
//[GET] api/users/:id
