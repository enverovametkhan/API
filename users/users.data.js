let dummyUsers = [
  {
    id: "007",
    username: "jason",
    email: "jason@hotmail.com",
    password: "$2b$10$5Pqhnzq5B3DZZS6dsCYRSOGEZJnII38sgBZagMtMo64jDUo3LSP4K",
    verifyEmail: "",
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
    verifyEmail: "verify.email",
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
    verifyEmail: "verify.email",
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
    newEmail: "email@mail.com",
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
