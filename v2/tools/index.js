const { default: axios } = require("axios");
const { Services2, Category2 } = require("../models/services");
let tools = {
  getServicesAPI: async (req, res) => {
    try {
      const services = await axios.post(
        `${process.env.API_ENDPOINT2}/services`,
        {
          api_id: process.env.API_ID_2,
          api_key: process.env.API_KEY_2,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!services.status) return new Error("Respon API Error");
      let servicesFiltered = [];
      services.data.data.forEach((e) => {
        if (e.category == "ORDER WEBISITE/DOMAIN/JASA FIX/DAN OPER IRVANKEDE")
          return;
        if (e.id == 3776 || e.id == 3777 || e.id == 3778 || e.id == 3865)
          return;
        if (e.status == "1") return servicesFiltered.push(e);
        return;
      });
      return servicesFiltered;
    } catch (error) {
      console.log(error);
    }
  },
  getServices: async () => {
    try {
      const services = await Services2.find().sort({ rate: 1 });
      return services;
    } catch (error) {
      console.log(error);
    }
  },
  getCategory: async () => {
    try {
      const category = await Category2.find()
        .collation({ locale: "en", strength: 2 })
        .sort({ name: 1 });
      let categories = [];
      category.forEach((e) => {
        if (e.name != "zzzzzz") return categories.push(e.name);
      });
      return categories;
    } catch (error) {
      console.log(error);
    }
  },
  getServicesByCategory: async (cat) => {
    try {
      const services = await Services2.find({ category: cat }).sort({
        rate: 1,
      });
      return services;
    } catch (error) {
      console.log(error);
    }
  },
  getServiceById: async (id) => {
    try {
      const service = await Services2.findOne({ serviceId: id });
      return service;
    } catch (error) {
      console.log(error);
    }
  },
  updateDatabase: async () => {
    try {
      const services = await tools.getServicesAPI();
      services.forEach(async (e) => {
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
          rate: parseInt(e.price) + rate(parseInt(e.price)),
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
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

module.exports = tools;
