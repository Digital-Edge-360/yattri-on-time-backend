const { Subcription } = require("../../models/Subcription");

const Add_ = (request, response) => {
  console.log(request.body);
  let { title, validity, price, compare_price, no_of_reminder } = request.body;
  if (!title || !validity || !price || !no_of_reminder)
    response.status(400).json({
      message: "title,validity,price,no_of_reminder, is requied",
    });
  else {
    let subscription = new Subcription();
    subscription.title = title;
    subscription.validity = validity;
    subscription.price = price;
    subscription.compare_price = compare_price ? compare_price : 0;
    subscription.no_of_reminder = no_of_reminder;
    subscription
      .save()
      .then((data) => {
        response.status(201).json(subscription);
      })
      .catch((err) => {
        console.log(err);
        response.status(500).json({ message: "internal server error" });
      });
  }
};

const Update_ = async (request, response) => {
  // response.status(403).json({ message: "request not allowed" });
  try {
    const update = { ...request.body };

    const subscription = await Subcription.findByIdAndUpdate(
      request.params.id,
      update
    );

    const udatedSubscription = await Subcription.findById(request.params.id);

    if (!subscription)
      return response
        .status(404)
        .json({ message: "No Subscription found with this Id" });

    return response.status(200).json({ udatedSubscription });
  } catch (err) {
    console.log(err);
    response.status(500).json({ message: "internal server error" });
    console.log(err);
  }
};

const Find_ = (request, response) => {
  Subcription.findById(request.params.id)
    .then((data) => {
      if (data == null) response.status(400).json({ message: "invalid id" });
      else response.status(200).json(data);
    })
    .catch((err) => {
      response.status(400).json({ message: "invalid id" });
    });
};

const FindAll_ = (request, response) => {
  Subcription.find()
    .then((data) => {
      if (data.length == 0)
        response.status(404).json({ message: "no data found" });
      else response.status(200).json(data);
    })
    .catch((err) => {
      response.status(500).json({ message: "internal server error" });
    });
};

const Remove_ = (request, response) => {
  Subcription.findByIdAndDelete(request.params.id)
    .then((data) => {
      if (data == null) response.status(400).json({ message: "invalid id" });
      else {
        response.status(202).json({ message: "data removed" });
      }
    })
    .catch((err) => {
      response.status(400).json({ message: "invalid id" });
    });
};

module.exports = { Find_, FindAll_, Add_, Update_, Remove_ };
