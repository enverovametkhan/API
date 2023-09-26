const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key";

async function createToken(payload, expiration) {
  return await jwt.sign(payload, JWT_SECRET, { expiresIn: expiration });
}

async function decryptToken(jwtToken) {
  return await jwt.verify(jwtToken, JWT_SECRET);
}

module.exports = { createToken, decryptToken };
