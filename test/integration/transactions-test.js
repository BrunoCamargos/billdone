const collectionName = 'transactions';

describe('Integration: ', () => {
  describe('Resources - Transactions', () => {
    beforeEach((done) => {
      getCollection(collectionName).drop()
        .then(() => done())
        .catch(() => done());
    });

    it('Should return a list of transactions', () => {
      const actual = [{
        type: 'expense',
        amount: -1567,
        description: 'expense test',
        _id: 1,
      }, {
        type: 'income',
        amount: 1678,
        description: 'income test',
        _id: 2,
      }];

      return getCollection(collectionName).insertMany(actual)
        .then((result) => {
          expect(result.insertedCount).to.equal(2);

          return request
            .get('/transactions')
            .expect(200)
            .then((res) => {
              const transactions = res.body;

              expect(transactions).to.have.lengthOf(2);
              expect(transactions).to.deep.eql(actual);
            });
        });
    });

    it('Should insert a transaction', () => {
      const actual = {
        type: 'expense',
        amount: -1567,
        description: 'expense test - insert',
      };

      return request
        .post('/transactions')
        .send(actual)
        .expect(201)
        .then((res) => {
          expect(res.headers).to.include.keys('location');

          return getCollection(collectionName).findOne(actual, { fields: { _id: 0 } })
            .then(expected => expect(expected).to.deep.equal(actual));
        });
    });

    it('Should return a BadRequest status on invalid payload', () => {
      const actual = {
        amount: -1567,
        description: 'expense test - invalid insert',
      };

      return request
        .post('/transactions')
        .send(actual)
        .expect(400)
        .then(res => expect(res.body).to.deep.equal({
          message: 'child "type" fails because ["type" is required]',
        }));
    });

    it('Should remove a transaction', () => {
      const actual = {
        type: 'expense',
        amount: -1567,
        description: 'expense test',
      };

      return getCollection(collectionName).insertOne(actual)
        .then((result) => {
          expect(result.insertedCount).to.equal(1);

          return request
            .delete(`/transactions/${actual._id}`)
            .expect(204);
        });
    });

    it('Should return transaction not found', () => request
      .delete('/transactions/58b2169e8d51e83a48b0b8d7')
      .expect(404)
      .then(res => expect(res.body).to.deep.equal({
        message: 'transaction not found',
      })));

    it('Should update a transaction', () => {
      let actual = {
        type: 'expense',
        amount: -1567,
        description: 'expense test - update',
      };

      return getCollection(collectionName).insertOne(actual)
        .then(result => expect(result.insertedCount).to.equal(1))
        .then(() => {
          const transactionId = actual._id;
          actual = {
            type: 'income',
            amount: 1377,
            description: 'expense test - updated',
          };

          return request.put(`/transactions/${String(transactionId)}`).send(actual).expect(204)
            .then(() => getCollection(collectionName).findOne(actual))
            .then(expected => expect(expected)
              .to.deep.equal(Object.assign({}, actual, { _id: transactionId })));
        });
    });
  });
});
