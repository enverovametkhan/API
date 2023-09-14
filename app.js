const moduleAlias = require("module-alias");
moduleAlias.addAlias("@root", __dirname);
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const routes = require("@root/routes/routes");

app.use(bodyParser.json());
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
