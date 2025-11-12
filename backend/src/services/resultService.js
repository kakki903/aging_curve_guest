const resultRepository = require("../repositories/resultRepository");

const resultService = {
  getId: async (resultId) => {
    const result = await resultRepository.getId(resultId);
    return result;
  },
};

module.exports = resultService;
