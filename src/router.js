const transactions = require('./transactions').routes;

module.exports = {
  handle(app) {
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.use('/transactions', transactions);
  },
};
