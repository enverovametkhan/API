const {
  login,
  signup,
  verifyEmail,
  logout,
  getUser,
  deleteUser,
  updateUser,
  refreshAccessToken,
} = require("./users.services");

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const response = await login(username, password);

    if (!response) {
      return res
        .status(401)
        .json({ error: "User not found or incorrect password" });
    }

    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function signupUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res
        .status(400)
        .json({ error: "Username, email, and password are required." });
      return;
    }

    const newUser = await signup(username, email, password);
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
};
