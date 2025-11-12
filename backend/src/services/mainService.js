const mainRepository = require("../repositories/mainRepository");

const mainService = {
  initSite: async () => {
    const result = await mainRepository.initSite();
    return result;
  },
};

module.exports = mainService;
