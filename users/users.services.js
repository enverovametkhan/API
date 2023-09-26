const bcrypt = require("bcrypt");
const {
  dummyUsers,
  dummyResetPasswordHash,
  dummyConfirmEmailHash,
} = require("./users.data");
const { createToken, decryptToken } = require("../jwt");

const saltRounds = 10;
let jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDciLCJlbWFpbCI6Imphc29uQGhvdG1haWwuY29tIiwidXNlcm5hbWUiOiJqYXNvbiIsImlhdCI6MTY5NTcxOTIyNCwiZXhwIjoxNzIxNjM5MjI0fQ.2Xene58uddYZEaoheZkg7uT9syhZURYeoryhf8RPe9Q";
async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function login(email, password) {
  if (!email) {
    throw new Error("Email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }

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

  const authToken = await createToken(userData, "300d");
  const refreshToken = await createToken(userData, "500h");

  user.authToken = authToken;
  user.refreshToken = refreshToken;

  const index = dummyUsers.findIndex((user) => user.id === user.id);
  if (index !== -1) {
    dummyUsers[index] = user;
  }

  return {
    authToken,
    refreshToken,
    userId: user.id,
    email: user.email,
    username: user.username,
  };
}

async function signup(username, email, password, confirmedPassword) {
  const user = dummyUsers.find((user) => user.email === email);

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
    authToken: "",
    refreshToken: "",
    deletedAt: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  newUser.magicLinkToken = await createToken({ user_id: newUser.id }, "300d");

  dummyUsers.push(newUser);

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

  user.verifyEmail = "";

  const index = dummyUsers.findIndex((user) => user.id === user.id);
  if (index !== -1) {
    dummyUsers[index] = user;
  }

  return { message: "Email has been verified", status: 200 };
}

async function logout() {
  let userData = await decryptToken(jwtToken);
  console.log(userData);
  const userIndex = dummyUsers.findIndex((user) => user.id === userData.userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const user = dummyUsers[userIndex];

  user.authToken = "";
  user.refreshToken = "";

  dummyUsers[userIndex] = user;

  return "User logged out successfully";
}

async function getUser() {
  const userData = await decryptToken(jwtToken);

  const user = dummyUsers.find((user) => user.id === userData.userId);

  if (!user) {
    throw new Error(`User not found for userId: ${userData.userId}`);
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

async function deleteUser() {
  const userData = await decryptToken(jwtToken);
  const userIndex = dummyUsers.findIndex((user) => user.id === userData.userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const user = dummyUsers[userIndex];
  user.deletedAt = Date.now();
  dummyUsers.splice(userIndex, 1);

  return "User deleted successfully";
}

async function updateUser(updatedUserData) {
  let userData = await decryptToken(jwtToken);
  const userIndex = dummyUsers.findIndex((user) => user.id === userData.userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const user = dummyUsers[userIndex];

  if (!updatedUserData.username && !updatedUserData.email) {
    throw new Error("Either username or email should be provided");
  }

  if (updatedUserData.email && updatedUserData.email !== user.email) {
    user.email = updatedUserData.email;
  }

  if (updatedUserData.username) {
    user.username = updatedUserData.username;
  }

  user.updatedAt = Date.now();
  dummyUsers[userIndex] = user;

  const response = {};

  if (updatedUserData.email) {
    response.email = "Updated successfully";
  }

  if (updatedUserData.username) {
    response.username = "Updated successfully";
  }

  return response;
}

async function refreshAuthToken() {
  let userData = await decryptToken(jwtToken);
  const index = dummyUsers.findIndex((user) => user.id === userData.userId);

  if (index === -1) {
    throw new Error("User not found");
  }

  const user = dummyUsers[index];

  let userDataToUpdate = {
    user_id: user.id,
    email: user.email,
    username: user.username,
  };

  const newRefreshToken = await createToken(userDataToUpdate, "100d");
  const newAuthToken = await createToken(userDataToUpdate, "300h");

  user.authToken = newAuthToken;
  user.refreshToken = newRefreshToken;

  dummyUsers[index] = user;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    authToken: user.authToken,
    refreshToken: user.refreshToken,
  };
}

async function resetPassword() {
  const userData = await decryptToken(jwtToken);

  const existResetPasswordHash = dummyResetPasswordHash.find(
    (each) => each.user_id === userData.user_id
  );

  if (existResetPasswordHash) {
    const index = dummyResetPasswordHash.findIndex(
      (each) => each.id === existResetPasswordHash.id
    );
    console.log("Found and deleted existing password reset");
    dummyResetPasswordHash.splice(index, 1);
  }

  const newResetPasswordHash = {
    id: "",
    user_id: userData.user_id,
    token: jwtToken,
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

function checkResetPasswordToken(token) {
  console.log(token);
  const existResetPasswordHash = dummyResetPasswordHash.find(
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

  const index = dummyUsers.findIndex((eachUser) => eachUser.id === user.id);
  if (index !== -1) {
    dummyUsers[index] = user;
  }

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
    id: "",
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

  const userIndex = dummyUsers.findIndex((eachUser) => eachUser.id === user.id);

  if (userIndex !== -1) {
    dummyUsers[userIndex] = user;
  }

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
  refreshAuthToken,
  resetPassword,
  checkResetPasswordToken,
  changePassword,
  swapEmail,
  confirmEmailSwap,
};
