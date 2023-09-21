const bcrypt = require("bcrypt");

module.exports = {
  async baseFunction(password) {
    let saltRounds = 10;

    let hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(
      `ENCRYPTED: $2b$10$Afp5Y40AhXaCv0qfX0Oww.f8OiAhf/FqIp4GtdK7N6XPCuv5Jgp82`
    );

    let discoverSecret = await bcrypt.compare(
      password,
      `$2b$10$Afp5Y40AhXaCv0qfX0Oww.f8OiAhf/FqIp4GtdK7N6XPCuv5Jgp82`
    );

    console.log(`HERE THE RESULT OF DECRYPTION: ${discoverSecret}`);

    console.log(hashedPassword);
    return hashedPassword;
  },
};

let newHash = await hashPassword(password);
console.log(newHash);
