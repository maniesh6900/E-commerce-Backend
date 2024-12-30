const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 4000;
const auth = require("./routes/auth");
const user = require("./routes/User");
const product = require("./routes/product");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
const Stripe = require("./routes/stripe")
const cors = require('cors');

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log("DB is conneted"))
.catch((err) => {console.log(err); 
})

app.use(cors());
app.use(express.json());
app.use("/auth", auth);
app.use("/user", user);
app.use("/products", product);
app.use("/cart", Cart);
app.use("/order", Order);
app.use("/payment", Stripe);


app.listen(PORT ,()=>{
    console.log(`PORT is Running on PORT Numner ${PORT}`);
})