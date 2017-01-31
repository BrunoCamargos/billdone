import transactionsRoutes from './transactions';

const handleRoutes = (app) => {
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.use('/transactions', transactionsRoutes);
};

export default handleRoutes;
