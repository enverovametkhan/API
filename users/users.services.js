const { dummyUsers } = require("./users.data");

module.exports = {
  async baseFunction(id) {
    return dummyUsers.name;
  },
};
