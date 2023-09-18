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
  try {
    const user = dummyUsers.find((user) => user.username === username);

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return null;
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
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function signup(username, email, password) {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);

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

    const authToken = generateAuthToken(newUser.id);

    newUser.authToken = authToken;

    return {
      authToken,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function generateAuthToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
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

async function getUser(userId) {
  const user = dummyUsers.find((user) => user.id === userId);

  if (!user) {
    console.error(`User not found for userId: ${userId}`);
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
