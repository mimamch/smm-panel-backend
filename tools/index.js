const { default: axios } = require("axios");
const { Services } = require("../app/models/services");

const getAllServices = async () => {
  try {
    // const response = await axios.post(process.env.API_ENDPOINT, {
    //   key: process.env.API_KEY,
    //   action: "services",
    // });
    // let responseFinal = [];
    // response.data.forEach((e) => {
    //   responseFinal.push({ finalPrice: makeFinalPrice(e.rate), ...e });
    // });

    const services = await Services.find().sort({ rate: 1 });

    return services;
  } catch (error) {
    console.log(error);
  }
};
const getServicesbyId = async (id) => {
  try {
    // const services = await getAllServices();
    // const serv = services.find((e) => {
    //   if (e.service == id) return e;
    // });

    const serv = await Services.findOne({ serviceId: id });

    return serv;
  } catch (error) {
    console.log(error);
  }
};

const getServicesbyCategory = async (cat) => {
  try {
    const serv = await Services.find({ category: cat }).sort({ rate: 1 });

    return serv;
  } catch (error) {
    console.log(error);
  }
};

const makeFinalPrice = (rate) => {
  let price = parseInt(rate) / 1000;
  if (price < 5) return Math.round(price + 2);
  else if (price <= 10) return Math.round(price + 4);
  else if (price <= 30) return Math.round(price + 10);
  else if (price <= 50) return Math.round(price + 15);
  else if (price <= 80) return Math.round(price + 20);
  else if (price <= 100) return Math.round(price + 25);
  else return Math.round(price + 40);
};

const isLoggin = (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).json({
        error: "Authentication Failed",
        msg: "Access Denied, You must login first.",
      });
    return next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllServices,
  getServicesbyId,
  makeFinalPrice,
  isLoggin,
  getServicesbyCategory,
};
