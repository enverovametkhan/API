const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  dummyUsers,
  dummyResetPasswordHash,
  dummyConfirmEmailHash,
} = require("./users.data");
const { createToken, decryptToken, JWT_SECRET } = require("../jwt");
const { useRouteLoaderData } = require("react-router-dom");

let jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDA3IiwiZW1haWwiOiJqYXNvbkBob3RtYWlsLmNvbSIsInVzZXJuYW1lIjoiamFzb24iLCJpYXQiOjE2OTUyODU5NzcsImV4cCI6MTY5NTcxNzk3N30.qFSP0gwYKkkC6bvNX4ZizbENdQq4_UoncVVjNPu3JDw";
let saltRounds = 10;

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
  let userData = await decryptToken(jwtToken);
  const user = dummyUsers.find((user) => user.id === userData.user_id);

  if (!user) {
    throw new Error("User not found");
  }

  user.deletedAt = Date.now();

  dummyUsers.push(user);
  return "User deleted successfully";
}

// async function updateUser(userId, updatedUserData) {
//   try {
//     let userData = await decryptToken(jwtToken);

//     const userIndex = dummyUsers.findIndex((user) => user.id === userId);

//     if (userIndex === -1) {
//       throw new Error("User not found");
//     }

//     const user = dummyUsers[userIndex];

//     if (updatedUserData.email && updatedUserData.email !== user.email) {
//       user.email = updatedUserData.email;

//       let magicLinkToken = await createToken({ user_id: user.id }, "1d");

//       let newMagicLink = {
//         id: "7777",
//         user_id: user.id,
//         token: magicLinkToken,
//         expiresAt: 1694855778,
//         createdAt: 1694855778,
//         updatedAt: 1694855778,
//       };

//       console.log(newMagicLink);
//       console.log("Sending link to email...");
//     }

//     user.username = updatedUserData.username || user.username;
//     user.updatedAt = Date.now();

//     dummyUsers[userIndex] = user;

//     return "User updated successfully";
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }

async function refreshAccessToken(refreshToken) {
  try {
    const decoded = await decryptToken(refreshToken);

    if (!decoded || !decoded.userId) {
      throw new Error("Invalid refresh token");
    }

    const userId = decoded.userId;

    const user = dummyUsers.find((user) => user.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    const userData = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = await createToken(userData, "1h");

    return {
      refreshToken,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Refresh Access Token Error:", error);
    throw error;
  }
}

async function updateUser(userId, updatedUserData) {
  try {
    let userData = await decryptToken(jwtToken);
    const userIndex = dummyUsers.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const user = dummyUsers[userIndex];

    if (updatedUserData.email && updatedUserData.email !== user.email) {
      user.email = updatedUserData.email;

      let magicLinkToken = await createToken({ user_id: user.id }, "1d");

      let newMagicLink = {
        id: "33333",
        user_id: user.id,
        token: magicLinkToken,
        expiresAt: 1694855778,
        createdAt: 1694855778,
        updatedAt: 1694855778,
      };

      console.log(newMagicLink);
      console.log("Sending link to email...");
    }

    user.username = updatedUserData.username || user.username;
    user.updatedAt = Date.now();

    dummyUsers[userIndex] = user;

    return "User updated successfully";
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function refreshAccessToken() {
  try {
    let userData = await decryptToken(jwtToken);
    const user = dummyUsers.find((user) => user.id === userData.user_id);

    if (!user) {
      throw new Error("User not found");
    }

    let userDataToUpdate = {
      user_id: user.id,
      email: user.email,
      username: user.username,
    };

    const refreshToken = await createToken(userDataToUpdate, "7d");
    const accessToken = await createToken(userDataToUpdate, "1h");

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    dummyUsers.push(user);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };
  } catch (error) {
    throw error;
  }
}

async function resetPassword() {
  try {
    let userData = await decryptToken(jwtToken);

    // Создать новый токен для сброса пароля
    let newJwtToken = createToken({ user_id: userData.user_id }, "7d");

    // Проверить, существует ли существующий токен сброса пароля
    let existResetPasswordHash = dummyResetPasswordHash.find(
      (each) => each.user_id === userData.user_id
    );

    if (existResetPasswordHash) {
      // Если существует, то удалить
      const index = dummyResetPasswordHash.findIndex(
        (each) => each.id === existResetPasswordHash.id
      );
      const deletedHash = dummyResetPasswordHash.splice(index, 1)[0];
      console.log("Found and deleted existing password reset");
    }
    // Создать новый токен
    let newResetPasswordHash = {
      id: "777",
      user_id: userData.user_id,
      token: newJwtToken,
      expiresAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dummyResetPasswordHash.push(newResetPasswordHash);

    return {
      status: 200,
      message: "Check your email for a reset password link",
    };
  } catch (error) {
    throw error;
  }
}

async function checkResetPasswordToken(token) {
  try {
    let existResetPasswordHash = dummyResetPasswordHash.find(
      (each) => each.token === token
    );

    if (!existResetPasswordHash) {
      throw new Error("Invalid token");
    }

    return {
      status: 200,
    };
  } catch (error) {
    throw error;
  }
}

async function changePassword(token, password, confirmedPassword) {
  try {
    const resetToken = dummyResetPasswordHash.find(
      (each) => each.token === token
    );

    if (!resetToken) {
      throw new Error("Invalid token");
    }

    if (password !== confirmedPassword) {
      throw new Error("Passwords do not match");
    }

    const user = dummyUsers.find(
      (eachUser) => eachUser.id === resetToken.user_id
    );

    if (!user) {
      throw new Error("User not found");
    }

    const newPassword = await bcrypt.hash(password, saltRounds);

    user.password = newPassword;

    return {
      status: 200,
      message: "Password reset successfully",
    };
  } catch (error) {
    throw error;
  }
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
  resetPassword,
  checkResetPasswordToken,
  changePassword,
};
