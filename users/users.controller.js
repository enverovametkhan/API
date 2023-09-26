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

async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

async function signupController(req, res) {
  try {
    const { username, email, password, confirmedPassword } = req.body;
    if (!username || !email || !password || !confirmedPassword) {
      return res.status(400).json({
        error: "Username, email, password, and confirmedPassword are required.",
      });
    }

    const newUser = await signup(username, email, password, confirmedPassword);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

async function verifyEmailController(req, res) {
  try {
    const { hash } = req.params;
    await verifyEmail(hash);
    res.json({ message: "Email has been verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}
async function logoutController(req, res) {
  try {
    const userId = "";
    await logout(userId);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

async function getUserController(req, res) {
  try {
    const user = await getUser();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

async function deleteUserController(req, res) {
  try {
    const userId = "";
    await deleteUser(userId);
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

async function updateUserController(req, res) {
  try {
    const updatedUserData = req.body;
    const result = await updateUser(updatedUserData);

    if (!result) {
      res.status(400).json({ message: "No valid updates provided" });
    } else {
      const statusCode = result.email || result.username ? 200 : 400;
      res.status(statusCode).json(result);
    }
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
}

async function refreshAuthTokenController(req, res) {
  try {
    let response = await refreshAuthToken();
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

async function resetPasswordController(req, res) {
  try {
    const { token } = req.body;
    console.log("Reset Password - Token:", token);
    const result = await resetPassword(token);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error(error);
    res
      .status(error.message === "User not found" ? 404 : 500)
      .json({ message: error.message });
  }
}

async function checkResetPasswordTokenController(req, res) {
  try {
    const { token } = req.params;
    console.log("Check Reset Password Token:", token);
    await checkResetPasswordToken(token);
    res.json({ message: "Token is valid" });
  } catch (error) {
    console.error(error);
    res
      .status(error.message === "Invalid token" ? 400 : 500)
      .json({ message: error.message });
  }
}

async function changePasswordController(req, res) {
  try {
    const { token, password, confirmedPassword } = req.body;
    await changePassword(token, password, confirmedPassword);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
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

async function confirmEmailSwapController(req, res) {
  try {
    const { hash } = req.params;
    await confirmEmailSwap(hash);
    res.json({ message: "Email swapped successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(error.message === "Email swapping error" ? 400 : 500)
      .json({ message: error.message });
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
