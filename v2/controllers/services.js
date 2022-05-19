const axios = require("axios");
const {
  getServices,
  getCategory,
  getServicesByCategory,
  getServiceById,
} = require("../tools");
module.exports = {
  getServices: async (req, res) => {
    try {
      if (req.query.id) {
        const service = await getServiceById(req.query.id);
        return res.status(200).json({
          length: service.length,
          data: service,
        });
      }
      const services = await getServices();
      res.status(200).json({
        length: services.length,
        data: services,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  getCategory: async (req, res) => {
    try {
      const { cat } = req.query;
      if (cat) {
        const services = await getServicesByCategory(cat);
        return res.status(200).json({
          length: services.length,
          data: services,
        });
      }
      const category = await getCategory();

      res.status(200).json({
        length: category.length,
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
};
