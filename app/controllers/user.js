const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HistoryOrder = require("../models/order");
module.exports = {
  register: async (req, res) => {
    try {
      const { username, fullName, email, phoneNumber } = req.body;
      const pw = req.body.password;
      const hashPass = await bcrypt.hash(pw, parseInt(process.env.SALT));
      const user = new User({
        password: hashPass,
        username,
        fullName,
        email,
        phoneNumber,
      });
      const data = await user.save();
      res.status(200).json({
        data: {
          username: data.username,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          _id: data._id,
        },
      });
    } catch (error) {
      if (error.code === 11000) {
        let key = Object.keys(error.keyValue)[0];
        let val = error.keyValue[key];
        return res.status(403).json({
          msg: `${key} ${val} Sudah Digunakan`,
        });
      }
      if (error.name === "ValidationError") {
        let errors = {};

        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });

        return res.status(400).json({ msg: Object.values(errors)[0] });
      }
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const query = await User.find({
        $or: [{ email: username }, { username: username }],
      });
      if (query.length == 0) {
        return res.status(404).json({
          msg: "Username/Email tidak ditemukan",
        });
      }
      if (!password)
        return res
          .status(400)
          .json({ msg: "Password yang anda masukkan salah" });
      const { password: pw } = query[0];
      const compare = await bcrypt.compare(password, pw);
      if (!compare) {
        return res
          .status(400)
          .json({ msg: "Password yang anda masukkan salah" });
      }

      const token = jwt.sign(
        {
          _id: query[0]._id,
          username: query[0].username,
          fullName: query[0].fullName,
          email: query[0].email,
          phoneNumber: query[0].phoneNumber,
          role: query[0].role,
        },
        process.env.SECRET_KEY
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 3600 * 24 * 30,
      });
      return res.status(200).json({
        msg: "OK",
        token: token,
      });
    } catch (error) {}
  },
  profile: async (req, res) => {
    try {
      const header = req.headers.authorization;
      if (!header)
        return res.status(401).json({
          msg: "Access Denied, You Must Login First.",
        });
      const token = header.split(" ")[1];
      const decoded = jwt.decode(token);
      const data = await User.findById(decoded._id).select("-password");
      res.status(200).json({ data });
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = {};

        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });

        return res.status(400).json({ msg: Object.values(errors) });
      }
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  history: async (req, res) => {
    try {
      const header = req.headers.authorization;
      if (!header)
        return res.status(401).json({
          msg: "Access Denied, You Must Login First.",
        });
      const token = header.split(" ")[1];
      const decoded = jwt.decode(token);
      const history = await HistoryOrder.find({
        user: decoded._id,
        apiVersion: req.query.api,
      }).sort({ createdAt: -1 });
      res.status(200).json({
        length: history.length,
        history: history,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  changeProfile: async (req, res) => {
    try {
      const header = req.headers.authorization;
      if (!header)
        return res.status(401).json({
          msg: "Access Denied, You Must Login First.",
        });
      const token = header.split(" ")[1];
      const decoded = jwt.decode(token);
      let hashPass = undefined;
      if (req.body.password) {
        if (req.body.password != req.body.confirmPassword)
          return res.status(500).json({
            msg: "Password dan Konfirmasi Password Tidak Sama!",
          });
        hashPass = bcrypt.hashSync(
          req.body.password,
          parseInt(process.env.SALT) || 10
        );
      }
      await User.findByIdAndUpdate(decoded._id, {
        username: req.body.username,
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: hashPass,
      });
      res.status(200).json({
        msg: "Profil Berhasil Diubah",
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
};
