const { Services2, Category2 } = require("../models/services");
const {
  getServicesAPI,
  getServices,
  updateDatabase,
  updateStatus,
} = require("../tools");

module.exports = {
  updateServices: async (req, res) => {
    try {
      const isUpdated = await updateDatabase();
      if (!isUpdated)
        return res.status(500).json({
          msg: "Fail Update Database",
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
  updateStatus: async (req, res) => {
    try {
      const isUpdated = await updateStatus();
      if (!isUpdated)
        return res.status(500).json({
          msg: "Fail Update Status",
        });
      res.status(200).json({
        msg: "Status Layanan Up To Date",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: error.message,
      });
    }
  },
};
