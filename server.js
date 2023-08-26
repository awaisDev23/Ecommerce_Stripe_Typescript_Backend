import express from "express";
import cors from "cors";
import Stripe from "stripe";
import bodyParser from "body-parser";
const stripe = new Stripe(
  "sk_test_51NdRuiHXG7QNx5YvqRBMlXmUD9zNtHhYPSWaHDmah6XJRR2GlLZxmwPJxJZETdWVCH2G2iG6IPdZ5sFnhyhYJj6A00Z7oy14PD"
);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.post("/create-payment-intent", async (req, res) => {
  //Getting Price of Our Product
  const specificItem = req?.body?.item[0];
  const priceOfSpecificItem = specificItem?.price;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceOfSpecificItem,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating payment intent." });
  }
});

const port = process.env.PORT || 4243;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
