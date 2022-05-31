const { Announcements } = require("../../app/models/announcements");

module.exports = {
  getAnnounce: async (req, res) => {
    try {
      const announce = await Announcements.find().sort({ createdAt: -1 });
      res.status(200).json({
        data: announce,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  addAnnounce: async (req, res) => {
    try {
      const announce = new Announcements({
        title: req.body.title,
        text: req.body.text,
      });
      await announce.save();
      res.status(200).json({
        data: announce,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  deleteAnnounce: async (req, res) => {
    try {
      const del = await Announcements.findByIdAndDelete(req.body.id);
      res.status(200).json({ data: del });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
};
