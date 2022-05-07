const { Services2, Category2 } = require("../models/services");
const { getServicesAPI, getServices } = require("../tools");

module.exports = {
  updateServices: async (req, res) => {
    try {
      const services = await getServicesAPI();
      services.forEach(async (e) => {
        if (e.service == 876) return;

        let rate = (price) => {
          if (price == 0) return 0;
          else if (price < 500) return 200;
          else if (price < 1000) return 500;
          else if (price < 3000) return 1000;
          else if (price < 5000) return 1500;
          else if (price < 15000) return 2000;
          else if (price < 30000) return 3000;
          else if (price < 50000) return 4500;
          else return 5500;
        };
        let update = {
          serviceId: e.id,
          name: e.name,
          category: e.category,
          rate: parseInt(e.price) + rate(e.price),
          min: e.min,
          max: e.max,
          desc: e.note,
        };
        let query = { serviceId: e.id };
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        await Services2.findOneAndUpdate(query, update, options);
      });

      //   UPDATE CATEGORY
      let category = [];

      services.forEach((e) => {
        if (category.indexOf(e.category) != -1) return;
        category.push(e.category);
      });
      category.forEach(async (e) => {
        let query = { name: e };
        let update = { name: e };
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        await Category2.findOneAndUpdate(query, update, options);
      });
      res.status(200).json({
        msg: "Services & Category Up To Date",
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
};
