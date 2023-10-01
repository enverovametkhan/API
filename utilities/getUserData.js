const { getNamespace } = require("cls-hooked");

const namespace = getNamespace("req");

async function getAccessToUserData() {
  let req = namespace.get("req");
  let userData = req.userData;
  return userData;
}

module.exports = { getAccessToUserData };
