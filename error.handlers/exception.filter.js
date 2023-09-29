module.exports = (app) => {
  app.use((err, req, res, next) => {
    console.error("Error Handling Middleware");
    console.error("Error handling");

    console.error(err);

    const timeTaken = (Date.now() - req.timeStarted) / 1000;
    console.log(`Time taken to process the request: ${timeTaken} seconds`);

    res.status(500).send({ message: err.message || "Internal Server Error" });
  });
};
