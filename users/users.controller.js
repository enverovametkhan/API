const {
  login,
  signup,
  verifyEmail,
  logout,
  getUser,
  deleteUser,
  updateUser,
  refreshAccessToken,
  resetPassword,
  checkResetPasswordToken,
  changePassword,
  swapEmail,
  confirmEmailSwap,
} = require("./users.services");

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const response = await login(email, password);

    if (response) {
      res.json(response);
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  } catch (error) {
    errorHandler(res, error, 500, "Login Error");
  }
}
async function signupUser(req, res) {
  try {
    const { username, email, password, confirmedPassword } = req.body;
    if (!username || !email || !password || !confirmedPassword) {
      res.status(400).json({
        error: "Username, email, password, and confirmedPassword are required.",
      });
      return;
    }

    const newUser = await signup(username, email, password, confirmedPassword);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function verifyUserEmail(req, res) {
  try {
    const { hash } = req.params;
    const response = await verifyEmail(hash);

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function logoutUser(req, res) {
  try {
    const userId = "007";
    const response = await logout(userId);

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getUserInfo(req, res) {
  try {
    const { id } = req.params;
    const user = await getUser(id);

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
async function deleteUserAccount(req, res) {
  try {
    const userId = "007";
    const response = await deleteUser(userId);

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
async function updateUserProfile(req, res) {
  const { id } = req.params;
  const updatedUserData = req.body;

  try {
    const result = await updateUser(id, updatedUserData);
    res.status(200).json({ message: result });
  } catch (error) {
    console.error("Update User Error:", error);
    res
      .status(error.message === "User not found" ? 404 : 500)
      .json({ message: error.message });
  }
}

async function refreshUserToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is missing" });
    }

    const response = await refreshAccessToken(refreshToken);

    res.send(response);
  } catch (error) {
    console.error("Refresh User Token Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function resetUserPassword(req, res) {
  try {
    const { token } = req.body;
    console.log("Reset Password - Token:", token);

    const result = await resetPassword(token);

    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Reset Password Error:", error);

    if (error.message === "User not found") {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

async function checkResetPassword(req, res) {
  try {
    const { token } = req.params;
    console.log("Check Reset Password Token:", token);

    const result = await checkResetPasswordToken(token);

    res.status(result.status).json({ message: "Token is valid" });
  } catch (error) {
    console.error("Check Reset Password Token Error:", error);

    if (error.message === "Invalid token") {
      res.status(400).json({ message: "Invalid token" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

async function changeUserPassword(req, res) {
  try {
    const { token, password, confirmedPassword } = req.body;
    const result = await changePassword(token, password, confirmedPassword);

    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(400).json({ message: error.message });
  }
}

async function swapUserEmail(req, res) {
  try {
    const { newEmail } = req.body;
    const result = await swapEmail(newEmail);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Swap Email Error:", error);
    res
      .status(error.message === "User not found" ? 404 : 500)
      .json({ message: error.message });
  }
}

async function confirmUserEmailSwap(req, res) {
  try {
    const { hash } = req.params;
    const result = await confirmEmailSwap(hash);

    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Email Swapping Error:", error);

    if (error.message === "User not found") {
      res.status(404).json({ message: "User not found" });
    } else {
      res
        .status(500)
        .json({ message: "Email swapping failed. Please try again later." });
    }
  }
}

module.exports = {
  loginUser,
  signupUser,
  verifyUserEmail,
  logoutUser,
  getUserInfo,
  deleteUserAccount,
  updateUserProfile,
  refreshUserToken,
  resetUserPassword,
  checkResetPassword,
  changeUserPassword,
  swapUserEmail,
  confirmUserEmailSwap,
};
