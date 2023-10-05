const {
  login,
  signup,
  verifyEmail,
  logout,
  getUser,
  deleteUser,
  updateUser,
  refreshAuthToken,
  resetPassword,
  checkResetPasswordToken,
  changePassword,
  swapEmail,
  confirmEmailSwap,
} = require("./users.services");

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);

    if (user) {
      res.json(user);
      next();
    } else {
      const error = new Error("Authentication failed");
      error.status = 401;
      throw error;
    }
  } catch (error) {
    const { id } = req.params;
    const errorMessage = {
      error: { ...error },
      function: "loginController",
      errorMessage: error.message || "Internal Server Error",
      id,
    };

    next(errorMessage);
  }
}

async function signupController(req, res, next) {
  try {
    const { username, email, password, confirmedPassword } = req.body;
    if (!username || !email || !password || !confirmedPassword) {
      const error = new Error(
        "Username, email, password, and confirmedPassword are required."
      );
      error.status = 400;
      throw error;
    }

    const newUser = await signup(username, email, password, confirmedPassword);
    res.status(201).json(newUser);
    next();
  } catch (error) {
    const errorMessage = {
      function: "signupController",
      errorMessage: error.message || "Internal Server Error",
    };

    next(errorMessage);
  }
}

async function verifyEmailController(req, res, next) {
  try {
    const { hash } = req.params;
    await verifyEmail(hash);

    res.json({ message: "Email has been verified" });
    next();
  } catch (error) {
    const errorMessage = {
      error: { ...error },
      function: "verifyEmailController",
      errorMessage: error.message || "Internal Server Error",
    };

    next(errorMessage);
  }
}

async function logoutController(req, res, next) {
  try {
    const userId = "";
    await logout(userId);
    res.status(200).json({ message: "Logged out successfully" });
    next();
  } catch (error) {
    const errorMessage = {
      error: { ...error },
      function: "logoutController",
      errorMessage: error.message || "Internal Server Error",
    };

    next(errorMessage);
  }
}

async function getUserController(req, res, next) {
  try {
    let response = await getUser();
    res.send(response);
    next();
  } catch (error) {
    const errorMessage = {
      error: { ...error },
      function: "getUserController",
      errorMessage: error.message || "Internal Server Error",
    };

    next(errorMessage);
  }
}

async function deleteUserController(req, res, next) {
  try {
    const { userId } = req.params;
    await deleteUser(userId);
    res.json({ message: "User deleted successfully" });
    next();
  } catch (error) {
    const errorMessage = {
      error: { ...error },
      function: "deleteUserController",
      errorMessage: error.message || "Internal Server Error",
    };
    next(errorMessage);
  }
}

async function updateUserController(req, res, next) {
  try {
    const updatedUserData = req.body;
    const response = await updateUser(updatedUserData);

    if (!response) {
      throw new Error("No valid updates provided");
    } else {
      res.json(response);
      next();
    }
  } catch (error) {
    const errorMessage = {
      error: { ...error },
      function: "updateUserController",
      errorMessage: error.message,
    };
    next(errorMessage);
  }
}

async function refreshAuthTokenController(req, res, next) {
  try {
    const response = await refreshAuthToken();
    res.send(response);
    next();
  } catch (error) {
    const errorMessage = {
      error: { ...error },
      function: "refreshAuthTokenController",
      errorMessage: error.message || "Internal Server Error",
    };
    next(errorMessage);
  }
}

async function resetPasswordController(req, res, next) {
  try {
    const { email } = req.params;

    const response = await resetPassword(email);

    res.status(response.status).json({ message: response.message });
    next();
  } catch (error) {
    console.error(error);

    const errorMessage = {
      error: { ...error },
      function: "resetPasswordController",
      errorMessage: error.message,
    };
    next(errorMessage);
  }
}

async function checkResetPasswordTokenController(req, res, next) {
  try {
    const { token } = req.params;
    console.log("Check Reset Password Token:", token);
    await checkResetPasswordToken(token);
    res.json({ message: "Token is valid" });
    next();
  } catch (error) {
    console.error(error);
    const errorMessage = {
      error: { ...error },
      function: "checkResetPasswordTokenController",
      errorMessage: error.message,
    };
    next(errorMessage);
  }
}

async function changePasswordController(req, res, next) {
  try {
    const { token, password, confirmedPassword } = req.body;

    await changePassword(token, password, confirmedPassword);

    res.json({ message: "Password changed successfully" });
    next();
  } catch (error) {
    console.error(error);

    const errorMessage = {
      error: { ...error },
      function: "changePasswordController",
      errorMessage: error.message,
    };
    next(errorMessage);
  }
}

// async function swapEmailController(req, res) {
//   try {
//     const { newEmail } = req.body;
//     await swapEmail(newEmail);
//     res.json({ message: "Please check your email for the link" });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(error.message === "User not found" ? 404 : 500)
//       .json({ message: error.message });
//   }
// }

async function confirmEmailSwapController(req, res, next) {
  try {
    const { hash } = req.params;

    await confirmEmailSwap(hash);

    res.json({ message: "Email swapped successfully" });
    next();
  } catch (error) {
    console.error(error);

    const errorMessage = {
      error: { ...error },
      function: "confirmEmailSwapController",
      errorMessage: error.message,
    };

    next(errorMessage);
  }
}

module.exports = {
  loginController,
  signupController,
  verifyEmailController,
  logoutController,
  getUserController,
  deleteUserController,
  updateUserController,
  refreshAuthTokenController,
  resetPasswordController,
  checkResetPasswordTokenController,
  changePasswordController,
  // swapEmailController,
  confirmEmailSwapController,
};
