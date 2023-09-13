const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const routes = require("./routes");
const { createToken } = require("./jwt");

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
