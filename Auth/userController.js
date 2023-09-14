const jwt = require("jsonwebtoken");
const jwtSecretKey = "my_secret_key";
const refreshTokens = [];

const users = [];

function signup(req, res) {
  const { email, username, password, confirmNewPassword } = req.body;

  if (password !== confirmNewPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = {
    email,
    username,
    password,
  };

  users.push(newUser);

  const accessToken = createAccessToken(newUser);

  const refreshToken = createRefreshToken(newUser);

  res.status(201).json({ status: "OK", accessToken, refreshToken });
}

function login(req, res) {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const accessToken = createAccessToken(user);

  const refreshToken = createRefreshToken(user);

  res.status(200).json({ authToken: accessToken, refreshToken });
}

function deleteUser(req, res) {
  const { email } = req.body;
  const index = users.findIndex((user) => user.email === email);

  if (index !== -1) {
    users.splice(index, 1);
    res.json({ status: "OK", message: "User deleted successfully" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
}

function refreshToken(req, res) {
  const { token } = req.params;

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ error: "Invalid token" });
  }

  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    const accessToken = createAccessToken(user);

    res.status(200).json({ authToken: accessToken });
  });
}

function logout(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const index = refreshTokens.indexOf(token);
  if (index !== -1) {
    refreshTokens.splice(index, 1);
  }

  res.json({ status: "OK", message: "Logged out successfully" });
}

function createAccessToken(user) {
  return jwt.sign({ email: user.email }, jwtSecretKey, {
    expiresIn: "1h",
  });
}

function createRefreshToken(user) {
  const refreshToken = jwt.sign({ email: user.email }, jwtSecretKey);
  refreshTokens.push(refreshToken);
  return refreshToken;
}

module.exports = {
  signup,
  login,
  deleteUser,
  refreshToken,
  logout,
};
