const { getNamespace } = require("cls-hooked");

const namespace = getNamespace("userData");

async function getAccessToUserData() {
  let userData = namespace.get("userData");
  return userData;
}

module.exports = { getAccessToUserData };
