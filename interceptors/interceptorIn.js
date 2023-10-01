module.exports = (app) => {
  app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.originalUrl}`);
    req.timeStarted = Date.now();
    next();
  });
};
