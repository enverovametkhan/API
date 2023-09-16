const { baseFunction } = require("./users.services");

module.exports = {
  async baseFunctionControllerUsers(req, res) {
    let response = await baseFunction();
    res.send(response);
  },
};
