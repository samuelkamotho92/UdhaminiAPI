const router = require("express").Router();
const stripe = require("stripe")("sk_test_51MQsVDA4djL6B7lelHp7qeLiNSGa4jMaHxjF3YEA7SfQxKliC7G7zTiyNIaKdQXb4vidsdvDXA58UKbj75Wq3V5Y00X3rQK9zc");
// test stripe card 4242 4242 4242 4242
router.post("/payment", (req, res) => {
  const { token, amount } = req.body;
  stripe.charges.create({
    source: token.id,
    amount: amount,
    currency: "usd",
  }).then((response) => {
    res.status(200).json(response);
  }
  ).catch((err) => {
    res.status(500).json(err);
  });
});

module.exports = router;
