const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  dummyUsers,
  dummyResetPasswordHash,
  dummyConfirmEmailHash,
} = require("./users.data");

const JWT_SECRET = "your-secret-key";
const JWT_EXPIRATION = "1h";

async function login(username, password) {
  const user = dummyUsers.find((user) => user.username === username);

  if (!user) {
    throw new Error("User not found");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Incorrect password");
  }

  const authToken = generateAuthToken(user.id);

  user.authToken = authToken;

  return {
    authToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
}

function generateAuthToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

async function signup(username, email, password) {
  const existingUser = dummyUsers.find((user) => user.email === email);
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password: hashedPassword,
    authToken: "",
    refreshToken: "",
    deletedAt: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  dummyUsers.push(newUser);

  return newUser;
}

async function verifyEmail(hash) {
  const emailHash = dummyConfirmEmailHash.find((item) => item.token === hash);

  if (!emailHash) {
    throw new Error("Invalid email verification token");
  }

  return "Email verified successfully";
}

async function logout(userId) {
  const user = dummyUsers.find((user) => user.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.authToken = "";

  return "Logged out successfully";
}

function getUser(userId) {
  const user = dummyUsers.find((user) => user.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

async function deleteUser(userId) {
  const userIndex = dummyUsers.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  dummyUsers[userIndex].deletedAt = Date.now();

  return "User deleted successfully";
}

async function updateUser(userId, updatedUserData) {
  const userIndex = dummyUsers.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const user = dummyUsers[userIndex];
  user.username = updatedUserData.username || user.username;
  user.email = updatedUserData.email || user.email;
  user.updatedAt = Date.now();

  return "User updated successfully";
}

async function refreshAccessToken(userId) {
  const user = dummyUsers.find((user) => user.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  const authToken = generateAuthToken(user.id);

  user.authToken = authToken;

  return {
    authToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
}

module.exports = {
  login,
  signup,
  verifyEmail,
  logout,
  getUser,
  deleteUser,
  updateUser,
  refreshAccessToken,
};
