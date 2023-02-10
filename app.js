require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();

// To receive request data need to be declared express json
app.use(express.json());

// To receive form data need to be declared express urlencoded
app.use(express.urlencoded({ extended: true }));
const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// This is another way to connect db

// mongoose.connect('mongodb://127.0.0.1:27017/firstCrud')
// .then(()=>console.log("DB is connected"))
// .catch((error)=>{
//     console.log("DB is not connected");
//     console.log(error);
//     process.exit(1);
// });

// To connect Db using a function
mongoose.set("strictQuery", false);
const connectionToDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/firstCrud");
    console.log("DB is connected");
  } catch (error) {
    console.log("DB is not connected");
    console.log(error.message);
    process.exit(1);
  }
};

const port = process.env.PORT || 5002;

// create model
const product = mongoose.model("products", Schema);
console.log("product: ", product);

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.listen(port, async () => {
  console.log(`Server is starting at http://localhost:${port}`);
  await connectionToDB();
});

// post data
app.post("/product", async (req, res) => {
  try {
    const title = req.body.title;
    console.log(req.body);
    // get data from request body
    const newProduct = new product({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
    });
    const proData = await newProduct.save();
    res.status(201).send(proData);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});
