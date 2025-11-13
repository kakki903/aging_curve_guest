const resultRepository = require("../repositories/resultRepository");

const resultService = {
  getId: async (resultId) => {
    const result = await resultRepository.getId(resultId);
    return result;
  },

  getProfile: async (birth, gender, isMarried, isDating) => {
    const result = await resultRepository.getProfile(
      birth,
      gender,
      isMarried,
      isDating
    );
    return result;
  },
};

module.exports = resultService;
