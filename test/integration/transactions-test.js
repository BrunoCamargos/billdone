const collectionName = 'transactions';

describe('Integration: ', () => {
  describe('Resources - Transactions', () => {
    beforeEach((done) => {
      getCollection(collectionName).drop()
        .then(() => done())
        .catch(() => done());
    });

    it('should return a list of transactions', () => {
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

    it('should not accept mime type other than application/json', () => request
      .get('/transactions')
      .set('Accept', 'text/html')
      .expect(406)
      .then(res => expect(res.body).to.deep.equal({
        message: 'type text/html is not acceptable, try changing to application/json',
      })));

    it('should accept mime type application/json', () => request
      .get('/transactions')
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => expect(res.body).to.have.lengthOf(0)));

    it('should insert a transaction', () => {
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

    it('should return a BadRequest status on invalid payload', () => {
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

    it('should return a transaction', () => {
      const actual = {
        type: 'expense',
        amount: -1567,
        description: 'expense test',
      };

      return getCollection(collectionName).insertOne(actual)
        .then((result) => {
          expect(result.insertedCount).to.equal(1);

          return request
            .get(`/transactions/${String(actual._id)}`)
            .expect(200)
            .then((res) => {
              expect(res.body).to.deep.eql(Object.assign({}, actual, { _id: String(actual._id) }));
            });
        });
    });

    it('should return BadRequest trying to get a non-existent transaction', () => request
      .get('/transactions/58b2169e8d51e83a48b0b8d7')
      .expect(404)
      .then(res => expect(res.body).to.deep.equal({
        message: 'transaction not found',
      })));

    it('should remove a transaction', () => {
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

    it('should receive NotFound status when trying to delete a non-existent transaction', () => request
      .delete('/transactions/58b2169e8d51e83a48b0b8d7')
      .expect(404)
      .then(res => expect(res.body).to.deep.equal({
        message: 'transaction not found',
      })));

    it('should update a transaction', () => {
      const transactionInserted = {
        type: 'expense',
        amount: -1567,
        description: 'expense test - update',
      };

      return getCollection(collectionName).insertOne(transactionInserted)
        .then(result => expect(result.insertedCount).to.equal(1))
        .then(() => {
          const transactionId = transactionInserted._id;
          const transactionPayload = {
            type: 'income',
            amount: 1377,
            description: 'expense test - updated',
          };

          return request.put(`/transactions/${String(transactionId)}`).send(transactionPayload).expect(200)
            .then(res => expect(res.body).to.deep
              .equal(Object.assign({}, transactionPayload, { _id: String(transactionId) })))
            .then(() => getCollection(collectionName).findOne(transactionPayload))
            .then(expected => expect(expected)
              .to.deep.equal(Object.assign({}, transactionPayload, { _id: transactionId })));
        });
    });

    it('should update a non-existent transaction', () => {
      const transactionId = '58b2169e8d51e83a48b0b8d7';
      const transactionPayload = {
        type: 'income',
        amount: 1179,
        description: 'income test - updated',
      };
      const expected = Object.assign({}, transactionPayload, { _id: transactionId });

      return request.put(`/transactions/${String(transactionId)}`).send(transactionPayload).expect(200)
        .then(res => expect(res.body).to.deep.equal(expected))
        .then(() => getCollection(collectionName).findOne(transactionPayload))
        .then(actual => expect(Object.assign({}, actual, { _id: String(actual._id) }))
          .to.deep.equal(expected));
    });

    it('should receive BadRequest status when trying to update with an invalid transactionId', () => {
      const transactionId = '58b2169e8d51e83a48b0b8dk';
      const transactionPayload = {
        type: 'income',
        amount: 1179,
        description: 'income test - updated',
      };

      return request.put(`/transactions/${String(transactionId)}`).send(transactionPayload).expect(400)
        .then(res => expect(res.body).to.deep.equal({
          message: 'transaction id must be a string of 24 hex characters',
        }));
    });
  });
});
