const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  dummyUsers,
  dummyResetPasswordHash,
  dummyConfirmEmailHash,
} = require("./users.data");
const { createToken, decryptToken, JWT_SECRET } = require("../jwt");

let jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDA3IiwiZW1haWwiOiJqYXNvbkBob3RtYWlsLmNvbSIsInVzZXJuYW1lIjoiamFzb24iLCJpYXQiOjE2OTUyODU5NzcsImV4cCI6MTY9NTcxNzk3N30.qFSP0gwYKkkC6bvNX4ZizbENdQq4_UoncVVjNPu3JDw";
let saltRounds = 10;

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function login(email, password) {
  const user = dummyUsers.find((user) => user.email === email);

  if (!user) {
    throw new Error("Incorrect login credentials");
  }

  if (user.verifyEmail) {
    throw new Error("Please verify your email address to continue");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Incorrect login credentials");
  }

  const userData = {
    userId: user.id,
    email: user.email,
    username: user.username,
  };

  const refreshToken = await createToken(userData, "7d");
  const accessToken = await createToken(userData, "1h");

  user.refreshToken = refreshToken;
  user.accessToken = accessToken;

  return {
    refreshToken,
    accessToken,
    userId: user.id,
    email: user.email,
    username: user.username,
  };
}

async function signup(username, email, password, confirmedPassword) {
  let user = dummyUsers.find((user) => user.email === email);

  if (user) {
    throw new Error("Email already exists.");
  }

  if (password !== confirmedPassword) {
    throw new Error("Passwords do not match.");
  }

  const hashedPassword = await hashPassword(password);

  const newUser = {
    id: "001",
    username: username,
    email: email,
    password: hashedPassword,
    verifyEmail: "verify.email",
    refreshToken: "",
    deletedAt: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dummyUsers.push(newUser);

  const magicLinkToken = await createToken({ user_id: newUser.id }, "1d");

  const newMagicLink = {
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

  const user = dummyUsers.find((user) => user.id === emailHash.user_id);

  if (!user) {
    throw new Error("User not found");
  }

  console.log("Email has been verified");

  user.verifyEmail = "";

  const index = dummyConfirmEmailHash.findIndex(
    (item) => item.id === emailHash.id
  );

  if (index !== -1) {
    dummyConfirmEmailHash.splice(index, 1);
  }

  return { message: "Verified Email", status: 200 };
}

async function logout(userId) {
  const user = dummyUsers.find((user) => user.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.refreshToken = "";

  return "Logged out successfully";
}

async function getUser(userId) {
  let userData = await decryptToken(jwtToken);
  const user = dummyUsers.find((user) => user.id === userData.user_id);

  if (!user) {
    throw new Error(`User not found for userId: ${userId}`);
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

  const user = dummyUsers[userIndex];
  user.deletedAt = Date.now();
  dummyUsers.splice(userIndex, 1);

  return "User deleted successfully";
}
async function updateUser(userId, updatedUserData) {
  const user = dummyUsers.find((user) => user.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (
    updatedUserData.email !== undefined &&
    updatedUserData.email !== user.email
  ) {
    user.email = updatedUserData.email;
  }

  user.username = updatedUserData.username || user.username;
  user.updatedAt = Date.now();

  return "User updated successfully";
}

async function refreshAccessToken() {
  let userData = await decryptToken(jwtToken);

  const user = dummyUsers.find((user) => user.id === userData.user_id);

  if (!user) {
    throw new Error("User not found");
  }

  const newAccessToken = await createToken(userData, "1h");

  user.accessToken = newAccessToken;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    accessToken: newAccessToken,
  };
}

async function resetPassword() {
  let userData = await decryptToken(jwtToken);

  let newJwtToken = createToken({ user_id: userData.user_id }, "7d");

  let existResetPasswordHash = dummyResetPasswordHash.find(
    (each) => each.user_id === userData.user_id
  );

  if (existResetPasswordHash) {
    const index = dummyResetPasswordHash.findIndex(
      (each) => each.id === existResetPasswordHash.id
    );
    const deletedHash = dummyResetPasswordHash.splice(index, 1)[0];
    console.log("Found and deleted existing password reset");
  }

  let newResetPasswordHash = {
    id: "",
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
}

async function checkResetPasswordToken(token) {
  console.log(token);
  let existResetPasswordHash = dummyResetPasswordHash.find(
    (each) => each.token === token
  );

  if (!existResetPasswordHash) {
    throw new Error("Invalid token");
  }

  return {
    status: 200,
  };
}

async function changePassword(token, password, confirmedPassword) {
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
    message: "Password changed successfully",
  };
}

async function swapEmail(newEmail) {
  console.log(newEmail);
  const userData = await decryptToken(jwtToken);
  const user = dummyUsers.find((eachUser) => eachUser.id === userData.user_id);

  if (!user) {
    throw new Error("User not found");
  }

  const existEmailSwap = dummyConfirmEmailHash.find(
    (each) => each.user_id === user.id
  );

  if (existEmailSwap) {
    const index = dummyConfirmEmailHash.findIndex(
      (each) => each.id === existEmailSwap.id
    );
    dummyConfirmEmailHash.splice(index, 1);
    console.log("Found an existing email swap request. Deleting it.");
  }

  const magicLinkToken = await createToken({ user_id: user.id }, "1d");

  const swapEmailData = {
    id: "5555",
    user_id: user.id,
    newEmail: newEmail,
    token: magicLinkToken,
    expiresAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dummyConfirmEmailHash.push(swapEmailData);

  return {
    status: 200,
    message: "Please check your email for the link",
  };
}

async function confirmEmailSwap(hash) {
  const checkEmailSwap = dummyConfirmEmailHash.find(
    (each) => each.token === hash
  );

  if (!checkEmailSwap) {
    throw new Error("Email swapping error");
  }

  const user = dummyUsers.find(
    (eachUser) => eachUser.id === checkEmailSwap.user_id
  );

  if (!user) {
    throw new Error("User not found");
  }

  console.log(user);

  console.log(`Swapped email from ${user.email} to ${checkEmailSwap.newEmail}`);

  user.email = checkEmailSwap.newEmail;

  const index = dummyConfirmEmailHash.findIndex((item) => item.token === hash);
  if (index !== -1) {
    dummyConfirmEmailHash.splice(index, 1);
  }

  return {
    status: 200,
    message: `Email swapped successfully from ${user.email} to ${checkEmailSwap.newEmail}`,
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
  resetPassword,
  checkResetPasswordToken,
  changePassword,
  swapEmail,
  confirmEmailSwap,
};
