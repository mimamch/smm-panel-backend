const { default: axios } = require("axios");
const { default: mongoose } = require("mongoose");
const { Category, Services } = require("../app/models/services");

module.exports = {
  updateDatabase: async (req, res) => {
    try {
      const response = await axios.post(process.env.API_ENDPOINT, {
        key: process.env.API_KEY,
        action: "services",
      });

      //   UPDATE CATEGORY

      //   UPDATE SERVICES

      response.data.forEach(async (e) => {
        if (e.service == 876) return;
        let query = { serviceId: e.service };
        let rate = (price) => {
          if (price < 500) return 200;
          else if (price < 1000) return 500;
          else if (price < 3000) return 1000;
          else if (price < 5000) return 1500;
          else if (price < 15000) return 2000;
          else if (price < 30000) return 3000;
          else return 5500;
        };
        let update = {
          serviceId: e.service,
          name: e.name,
          type: e.type,
          category: e.category,
          rate: parseInt(e.rate) + rate(e.rate),
          min: e.min,
          max: e.max,
          desc: e.member_info,
          dripfeed: e.dripfeed,
          refill: e.refill,
        };
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        let model = await Services.findOneAndUpdate(query, update, options);
      });
      console.log("SERVICES UPDATED");

      let category = [];
      response.data.forEach((e) => {
        if (category.indexOf(e.category) != -1) return;
        category.push(e.category);
      });

      category.forEach(async (e) => {
        //   const {name} = await Category.findOne({name: e.name})
        //   if(!name) return await
        let query = { name: e };
        let update = { name: e };
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        let model = await Category.findOneAndUpdate(query, update, options);
      });
      console.log("CATEGORY UPDATED");

      return;
    } catch (error) {
      console.log("UPDATE ERROR>", error);
    }
  },
};
