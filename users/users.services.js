const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  dummyUsers,
  dummyResetPasswordHash,
  dummyConfirmEmailHash,
} = require("./users.data");
const { createToken, decryptToken } = require("../jwt");
const { useRouteLoaderData } = require("react-router-dom");

async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function login(email, password) {
  try {
    const user = dummyUsers.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    if (!validPassword) {
      return null;
    }

    let userData = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const refreshToken = await createToken(userData, "7d");
    const accessToken = await createToken(userData, "1h");

    return {
      refreshToken,
      accessToken,
      userId: user.id,
      email: user.email,
      username: user.username,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function signup(username, email, password, confirmedPassword) {
  console.log(`${email}, ${username}, ${password}, ${confirmedPassword}`);

  let user = dummyUsers.find((user) => user.email === email);
  if (user) {
    throw new Error("Email already exists.");
  }

  if (password !== confirmedPassword) {
    throw new Error("Passwords do not match.");
  }

  let saltRounds = 10;
  let hashedPassword = await bcrypt.hash(password, saltRounds);

  let newUser = {
    id: "001",
    username: username,
    email: email,
    password: hashedPassword,
    refreshToken: "",
    deletedAt: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dummyUsers.push(newUser);

  let magicLinkToken = await createToken({ user_id: newUser.id }, "1d");

  let newMagicLink = {
    id: "7777",
    user_id: newUser.id,
    token: magicLinkToken,
    expiresAt: 1694855778,
    createdAt: 1694855778,
    updatedAt: 1694855778,
  };

  console.log(newMagicLink);

  return newUser;
}

async function verifyEmail(hash) {
  const emailHash = dummyConfirmEmailHash.find((item) => item.token === hash);

  if (!emailHash) {
    throw new Error("Invalid email verification token");
  }
  console.log("Email has been verifed");
  const index = dummyConfirmEmailHash.findIndex(
    (item) => item.id === emailHash.id
  );
  const deleteEmailHash = dummyConfirmEmailHash.splice(index, 1)[0];

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
  try {
    let jwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InNtaXRoIiwiaWF0IjoxNTE2MjM5MDIyfQ.SO0OIwKXnr6LFIg77qTn2W4Hfjq-2AdO7Iu9l5pq654";
    let userData = await decryptToken(jwtToken);
    const user = dummyUsers.find((user) => user.id === userData.user_id);

    if (!user) {
      console.error(`User not found for userId: ${userId}`);
      throw new Error("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    let userData = await decryptToken(jwtToken);
    const user = dummyUsers.find((user) => user.id === userData.userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.deletedAt = Date.now();

    dummyUsers.push(user);
    return "User deleted successfully";
  } catch (error) {
    console.error(error);
    throw error;
  }
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
