const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const stripe = require("stripe")('sk_test_51Ot2QtSIBQZVLj4aFkVnAl3ZZz0Z53rq5RM8m89p9vSoMYWRrUijs48XJHqa5XflPFHmS8YmOLwgHyIn17ifAx1d00cfpkb4wf');
const jwt = require('jsonwebtoken');

// middleware
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    `mongodb+srv://Deepak25:gta5mods@cluster0.bk2xyo5.mongodb.net/Modified-Doodie-Rajeev?retryWrites=true&w=majority`
  )
  .then(console.log("Mongodb connected successfully!"))
  .catch((error) => console.log("Error connecting to MongoDB: " + error));

// jwt authentication

// jwt related api
app.post("/jwt", async (req, res) => {
  const user = req.body;
  // console.log(user)
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.send({ token });
});

// import routes
const menuRoutes = require("./api/routes/menuRoutes");
const cartsRoutes = require("./api/routes/cartRoutes");
const usersRoutes = require("./api/routes/userRoutes");
const paymentRoutes = require("./api/routes/paymentRoutes");
const adminStats =  require('./api/routes/adminStats');
const orderStats = require('./api/routes/orderStats');
const messageRoutes = require('./api/routes/messageRoutes');
const commentsRouter = require('./api/routes/commentRoutes');
const jobsRouter = require('./api/routes/jobsRoutes');
const applyRouter = require('./api/routes/applyRoutes');
app.use("/menu", menuRoutes);
app.use("/carts", cartsRoutes);
app.use("/users", usersRoutes);
app.use("/payments", paymentRoutes);
app.use('/admin-stats', adminStats);
app.use('/order-stats', orderStats);
app.use('/message', messageRoutes);
app.use('/comments', commentsRouter);
app.use('/jobs', jobsRouter);
app.use('/apply', applyRouter);

// payment methods routes
const verifyToken = require('./api/middlewares/verifyToken')

app.post("/create-payment-intent",verifyToken, async (req, res) => {
  const { price } = req.body;
  const amount = price*100;
  // console.log(amount);

  // Create a PaymentIntent 
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "inr",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/", (req, res) => {
  res.send("Royalties Buffet Server is Running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
