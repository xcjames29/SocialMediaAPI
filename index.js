require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const PORT = 8111;




app.use(morgan("dev"));
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongo DB Connected")
}).catch((e) => {
    console.log(e.message);
});

let UserRouter = require("./router/user")
app.use(UserRouter)


app.listen(PORT, () => {
    console.log("Server is listening to PORT:" + PORT);
});