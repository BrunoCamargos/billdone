import transactionsRoutes from './transactions';

const handleRoutes = app => {
  app.use('/transactions', transactionsRoutes);
};

export default handleRoutes;
