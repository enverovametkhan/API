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
} = require("./users.services");

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const response = await login(email, password);

    if (!response) {
      return res
        .status(401)
        .json({ error: "User not found or incorrect password" });
    }

    return res.json(response);
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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

    if (!response) {
      res.status(404).send();
      return;
    }

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

    if (!response) {
      res.status(404).send();
      return;
    }

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

    if (!user) {
      res.status(404).send();
      return;
    }

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

    if (!response) {
      res.status(404).send();
      return;
    }

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function updateUserProfile(req, res) {
  try {
    const userId = "007";
    const updatedUserData = req.body;
    const response = await updateUser(userId, updatedUserData);

    if (!response) {
      res.status(404).send();
      return;
    }

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function refreshUserToken(req, res) {
  try {
    const { id } = req.params;
    console.log("Refresh User Token - ID:", id);
    const response = await refreshAccessToken(id);

    if (!response) {
      res.status(404).send();
      return;
    }

    res.send(response);
  } catch (error) {
    console.error("Refresh User Token Error:", error);
    res.status(500).send("Internal Server Error");
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
      const { token } = req.body;
      console.log("Check Reset Password Token:", token);

      const result = await checkResetPasswordToken(token);

      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Check Reset Password Token Error:", error);

      if (error.message === "Invalid token") {
        res.status(400).json({ message: "Invalid token" });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
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
};
