const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key";

async function createToken(payload, expiration) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiration });
}

async function decryptToken(token) {
  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    throw error;
  }
}
module.exports = { createToken, decryptToken };
