const { default: axios } = require("axios");
const { Services2, Category2 } = require("../models/services");

module.exports = {
  getServicesAPI: async (req, res) => {
    try {
      const services = await axios.post(
        "https://irvankede-smm.co.id/api/services",
        {
          api_id: 28958,
          api_key: "19f73c-5b066e-ff4df4-05507c-7c764e",
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
      const category = await Category2.find();
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
};
