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
const stripeRoute = require("./routes/stripe");
const multer = require('multer');
const fs = require('fs');


//middlewares
dotenv.config();
app.use(express.json()); //app is able to send JSON requests
app.use("/images", express.static(path.join(__dirname, '/images'))); //using path lib to acess images in folders
app.use(cors());//using path lib to acCess images in folders


//storage to store images
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
app.delete('/api/imageDelete/:filename', (req, res) => {
    const filePath = path.join('images/', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            res.status(500).json({ message: 'Error deleting image' });
        } else {
            res.json({ message: 'Image deleted' });
        }
    });
});

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


//server running port
app.listen(process.env.PORT || 5000, () => {
    console.log('Server running');
});
