const agingService = require("../services/agingService");

const agingController = {
  init: async (req, res) => {
    const { birthDate, birthTime, gender, isMarried, isDating } = req.body;
    const birth = birthDate + " " + birthTime;
    const result = await agingService.init(birth, gender, isMarried, isDating);
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        resultId: result.resultId,
      });
    }
  },

  reInit: async (req, res) => {
    const { birthDate, gender, isMarried, isDating } = req.body;
    const result = await agingService.reInit(
      birthDate,
      gender,
      isMarried,
      isDating
    );
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        resultId: result.resultId,
      });
    }
  },
};

module.exports = agingController;
