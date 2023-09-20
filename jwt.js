const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key";

async function createToken(payload, expiration) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiration });
}

async function decryptToken(token) {
  return await jwt.verify(token, JWT_SECRET);
}
module.exports = { createToken, decryptToken };
