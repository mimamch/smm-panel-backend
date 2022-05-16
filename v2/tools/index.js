const { default: axios } = require("axios");
const req = require("express/lib/request");
const HistoryOrder = require("../../app/models/order");
const User = require("../../app/models/user");
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
      await Services2.deleteMany({});
      await Category2.deleteMany({});
      console.log("DB FLUSHED");
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
  updateStatus: async (id) => {
    try {
      const orderHis = await HistoryOrder.find({ orderStatus: "pending" });
      orderHis.forEach(async (e) => {
        const check = await axios.post(
          `${process.env.API_ENDPOINT2}/status`,
          {
            api_id: process.env.API_ID_2,
            api_key: process.env.API_KEY_2,
            id: e.orderId,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // console.log(check.data.data);
        // console.log(check.data);
        if (check.data.status == true) {
          if (check.data.data.status.toLowerCase() == "success") {
            // return console.log(e.orderId);
            await HistoryOrder.findOneAndUpdate(
              { orderId: e.orderId },
              { orderStatus: "success" }
            );
            return;
          }
          if (check.data.data.status.toLowerCase() == "error") {
            // return console.log(e.orderId);
            const hist = await HistoryOrder.findOneAndUpdate(
              { orderId: e.orderId },
              { orderStatus: "failed" }
            );
            const user = await User.findById(hist.user);
            user.balance += hist.amount;
            hist.balanceAfter = hist.balanceBefore;
            hist.amount = 0;
            await user.save();
            await hist.save();
            return;
          } else if (check.data.data.status.toLowerCase() == "partial") {
            const his = await HistoryOrder.findById(e._id);
            const service = await tools.getServiceById(his.serviceId);
            const refund = Math.ceil(
              (service.rate / 1000) * parseInt(check.data.data.remains)
            );
            const amountFinal = his.amount - refund;
            const user = await User.findById(his.user);
            user.balance += refund;
            his.orderStatus = "partial";
            his.quantity = his.quantity - parseInt(check.data.data.remains);
            his.amount = amountFinal;
            his.balanceAfter = his.balanceBefore + refund;
            await his.save();
            await user.save();
          }
        } else if (check.data.status == false) {
          await HistoryOrder.findOneAndUpdate(
            { orderId: e.orderId },
            { orderStatus: "failed" }
          );
        }
      });
      return true;
    } catch (error) {
      console.log(error.message);
      console.log("ERRRRORRR");
      return false;
    }
  },
};

module.exports = tools;
