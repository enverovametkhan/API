const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key";

async function createToken(payload, expiration) {
  try {
    return await jwt.sign(payload, JWT_SECRET, { expiresIn: expiration });
  } catch (error) {
    throw new Error("Error creating JWT token");
  }
}

async function decryptToken(jwtToken) {
  try {
    return await jwt.verify(jwtToken, JWT_SECRET);
  } catch (error) {
    throw new Error("Error decrypting JWT token");
  }
}

module.exports = { createToken, decryptToken };
