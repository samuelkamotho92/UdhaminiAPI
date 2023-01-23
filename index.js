const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const adminRoute = require('./routes/admin');
const scholarshipRoute = require('./routes/scholarship');
//const imageUploadRoute = require('./routes/imageUpload');


//middlewares
dotenv.config();
app.use(express.json()); //app is able to send JSON requests
//app.use("/images", express.static(path.join(__dirname, '/images')));
 //using path lib to acess images in folders
app.use(cors());
//connect to mongodb
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("connected to mongodb"))
    .catch((err) => console.log(err));

//define my routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/checkout", stripeRoute);
app.use("/api/scholarship", scholarshipRoute); //api/scholarship/register
//app.use("/api/image", imageUploadRoute);
 //api/image/imageUpload

//server running port
app.listen( 8000, () => {
    console.log('Server running');
});
    //routes for admin
//[POST] api/admin/adminRegister
//[POST] api/admin/adminLogin
//[PUT] api/admin/:id
//[DELETE] api/admin/:id
//[GET] api/admin/:id
//[GET] api/admin/allUsers


    //Routes for image
//[POST] api/image/imageUpload
//[DELETE] api/image/imageDelete/:fileName

   //Routes for users
//[GET] api/users/all
//[PUT] api/users/:id
//[DELETE] api/users/:id
//[GET] api/users/:id


    //Routes for scholarship
//[POST] api/scholarship/register
//[PUT] api/scholarship/:id
//[DELETE] api/scholarship/:id
//[GET] api/scholarship/:id
//[GET] api/scholarship/all
//[POST] api/scholarship/premium

    //Routes for Auth
//[POST] api/auth/userRegister
//[POST] api/auth/userLogin

    //Routes for users
//[GET] api/users/all
//[PUT] api/users/:id
//[DELETE] api/users/:id
//[GET] api/users/:id
