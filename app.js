const moduleAlias = require("module-alias");
moduleAlias.addAlias("@root", __dirname);
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { createNamespace } = require("cls-hooked");
const userAuthNamespace = createNamespace("userAuthNamespace");

function attachRequestContext(req, res, next) {
  userAuthNamespace.run(() => {
    userAuthNamespace.set("req", req);
    next();
  });
}

app.use(bodyParser.json());
app.use(attachRequestContext);

const routes = require("./routes/routes");
app.use(routes);

app.listen(port, (err) => {
  if (err) {
    console.error(`Error starting the server: ${err.message}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
