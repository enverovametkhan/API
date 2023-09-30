// const jwt = require("jsonwebtoken");
// const jwtSecretKey = "your-secret-key";

// async function authMiddleware(req, res, next) {
//   try {
//     let authToken =
//       req.headers.authtoken ||
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDciLCJlbWFpbCI6Imphc29uQGhvdG1haWwuY29tIiwidXNlcm5hbWUiOiJqYXNvbiIsImlhdCI6MTY5NTkxOTg0NSwiZXhwIjoxNzIxODM5ODQ1fQ.NjTdeOazyQ3A1wxqnAfXjH2iYLx-MZw5r0adHmNdbgA";

//     if (!authToken) {
//       return res.status(401).json({
//         error:
//           "Access denied. Please provide a valid token for authentication.",
//       });
//     }

//     let userData = await jwt.verify(authToken, jwtSecretKey);

//     req.userData = {
//       ...userData,
//     };

//     next();
//   } catch (err) {
//     console.error(err);

//     let errorMessage = {
//       ...err,
//       function: "authMiddleware",
//       errorMessage:
//         "Access denied. Please provide a valid token for authentication.",
//     };

//     next(errorMessage);
//   }
// }

// module.exports = { authMiddleware };

const jwt = require("jsonwebtoken");

const jwtSecretKey = "your-secret-key";

async function authMiddleware(req, res, next) {
  try {
    // we accept the token from Headers in the postman but for the sake of this example we use the hardcoded data
    let authToken =
      req.headers.authtoken ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDciLCJlbWFpbCI6Imphc29uQGhvdG1haWwuY29tIiwidXNlcm5hbWUiOiJqYXNvbiIsImlhdCI6MTY5NTkxOTg0NSwiZXhwIjoxNzIxODM5ODQ1fQ.NjTdeOazyQ3A1wxqnAfXjH2iYLx-MZw5r0adHmNdbgA";

    //   we decrypt JWT token here and save the result in customData
    let userData = await jwt.verify(authToken, jwtSecretKey);

    // then we create a new object inside of the requst object called customData
    // this will ensure that we can have access to it anywhere in the application where req object is present
    // -
    // For TAG:001, thats where we set customData object
    req.userData = {
      ...userData,
    };

    next(); // Continue to the next middleware or route handler
  } catch (err) {
    console.log(err);
    let errorMessage = {
      ...err,
      function: "AuthMiddleware",
      customMessage: "Unauthorized",
    };

    // if an error occured we passed a modifed error object and its passed down to exception filter
    // In "errorHandlers/exceptionFilter.js"
    next(errorMessage); // Pass the error to the error handling middleware
  }
}

module.exports = { authMiddleware };
