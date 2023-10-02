module.exports = (app) => {
  app.use((req, res, next) => {
    res.setHeader("x-custom-header", Date.now());

    console.log(`Incoming Request: ${req.originalUrl}`);
    req.timeStarted = Date.now();
    next();
  });
};
