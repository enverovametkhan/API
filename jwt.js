const jwt = require("jsonwebtoken");

const jwtSecretKey = "my_key";

function createToken(payload) {
  return jwt.sign(payload, jwtSecretKey, {
    expiresIn: "1h",
  });
}

module.exports = { createToken };
