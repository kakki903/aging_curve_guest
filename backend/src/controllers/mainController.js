const mainService = require("../services/mainService");

const mainController = {
  initSite: async (req, res) => {
    const result = await mainService.initSite();
    res.status(200).json({
      message: "성공",
      data: {
        time: result.time,
      },
    });
  },
};

module.exports = mainController;
