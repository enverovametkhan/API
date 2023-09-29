const jwt = require("jsonwebtoken");

const jwtSecretKey = "your-secret-key";

async function authMiddleware(req, res, next) {
  try {
    let authToken =
      req.headers.authtoken ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDciLCJlbWFpbCI6Imphc29uQGhvdG1haWwuY29tIiwidXNlcm5hbWUiOiJqYXNvbiIsImlhdCI6MTY5NTkxOTg0NSwiZXhwIjoxNzIxODM5ODQ1fQ.NjTdeOazyQ3A1wxqnAfXjH2iYLx-MZw5r0adHmNdbgA";

    if (!authToken) {
      return res.status(401).json({
        error:
          "Access denied. Please provide a valid token for authentication.",
      });
    }

    let customData = await jwt.verify(authToken, jwtSecretKey);

    req.customData = {
      ...customData,
    };

    next();
  } catch (err) {
    console.error(err);
    let errorMessage = {
      ...err,
      function: "authMiddleware",
      errorMessage:
        "Access denied. Please provide a valid token for authentication.",
    };

    next(errorMessage);
  }
}

module.exports = { authMiddleware };
