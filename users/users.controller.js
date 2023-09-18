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
    const user = await login(username, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function signupUser(req, res) {
  try {
    const { username, email, password } = req.body;
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
    const user = await getUser(userId);

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
    const response = await refreshAccessToken(id);

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
