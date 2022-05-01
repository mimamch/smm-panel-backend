const axios = require("axios");
const { apiConfig } = require("../../config");
const {
  getServicesbyId,
  makeFinalPrice,
  getAllServices,
  getServicesbyCategory,
} = require("../../tools");
module.exports = {
  getServices: async (req, res) => {
    try {
      if (req.query.id) {
        const query = await getServicesbyId(req.query.id);
        // const finalPrice = makeFinalPrice(query.rate);

        // return res.status(200).json({
        //   data: { finalPrice, ...query },
        // });
        return res.status(200).json({
          data: { query },
        });
      }
      // const response = await axios.post(process.env.API_ENDPOINT, {
      //   key: process.env.API_KEY,
      //   action: "services",
      // });
      // let responseFinal = [];
      // response.data.forEach((e) => {
      //   responseFinal.push({ finalPrice: makeFinalPrice(e.rate), ...e });
      // });
      const responseFinal = await getAllServices();

      res.status(200).json({
        length: responseFinal.length,
        data: responseFinal,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getCategory: async (req, res) => {
    try {
      const { cat } = req.query;
      let category = [];
      const response = await axios.post(process.env.API_ENDPOINT, {
        key: process.env.API_KEY,
        action: "services",
      });

      if (cat) {
        // let result = [];
        // response.data.forEach((e) => {
        //   if (cat != e.category) return;
        //   e.finalPrice = makeFinalPrice(e.rate);
        //   result.push(e);
        // });
        // result = result.sort((a, b) => {
        //   return a.rate - b.rate;
        // });
        const result = await getServicesbyCategory(cat);
        return res.status(200).json({
          length: result.length,
          data: result,
        });
      }
      response.data.forEach((e) => {
        if (category.indexOf(e.category) != -1) return;
        category.push(e.category);
      });

      res.status(200).json({
        length: category.length,
        data: category,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getServicesbyCategory: async (req, res) => {
    try {
      const cat = req.body.category;
      const response = await axios.post(process.env.API_ENDPOINT, {
        key: process.env.API_KEY,
        action: "services",
      });

      let result = [];
      response.data.forEach((e) => {
        if (cat != e.category) return;

        result.push(e);
      });
      res.status(200).json({
        data: result,
      });
    } catch (error) {}
  },
};
