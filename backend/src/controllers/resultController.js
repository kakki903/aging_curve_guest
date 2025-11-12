const resultService = require("../services/resultService");

const resultController = {
  getId: async (req, res) => {
    const { resultId } = req.params;
    const result = await resultService.getId(resultId);
    console.log(result);
    res.status(200).json({
      success: true,
      inputdata: result.user_input,
      data: result.result_data,
      resultId: result.result_id,
    });
  },
};

module.exports = resultController;
