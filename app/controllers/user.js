const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
      const { username, email, password } = req.body;
      const query = await User.find({
        $or: [{ email: email }, { username: username }],
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
        },
        process.env.SECRET_KEY
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600 * 24 * 30,
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
};
