let dummyUsers = [
  {
    id: "007",
    username: "jason",
    email: "jason@hotmail.com",
    password: "$2b$10$Nogp/zjZpcfAEvsoLJwbTO4MxwSrdyGjJQrNUqVqbO5NKH1CydzD6",
    authToken: "001",
    refreshToken: "",
    deletedAt: "",
    createdAt: 1694855778,
    updatedAt: 1694855778,
  },
  {
    id: "777",
    username: "smith",
    email: "smith@hotmail.com",
    password: "hash64",
    authToken: "002",
    refreshToken: "",
    deletedAt: "",
    createdAt: 1694855778,
    updatedAt: 1694855778,
  },
  {
    id: "067",
    username: "jackson",
    email: "jackson@hotmail.com",
    password: "hash64",
    authToken: "003",
    refreshToken: "",
    deletedAt: "",
    createdAt: 1694855778,
    updatedAt: 1694855778,
  },
];
let dummyResetPasswordHash = [
  {
    id: "000",
    user_id: "067",
    token: "resetPasswordHash001",
    expiresAt: 1694855778,
    createdAt: 1694855778,
    updatedAt: 1694855778,
  },
];

let dummyConfirmEmailHash = [
  {
    id: "001",
    user_id: "777",
    token: "confirmEmail011",
    expiresAt: 1694855778,
    createdAt: 1694855778,
    updatedAt: 1694855778,
  },
];

module.exports = {
  dummyUsers,
  dummyResetPasswordHash,
  dummyConfirmEmailHash,
};
