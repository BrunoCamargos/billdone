const collectionName = 'transactions';

describe('Integration: ', () => {
  describe('Resources - Transactions', () => {
    beforeEach((done) => {
      getCollection(collectionName)
        .drop()
        .then(() => done())
        .catch(() => done());
    });

    it('should return a list of transactions', () => {
      const expected = [{
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

      return getCollection(collectionName)
        .insertMany(expected)
        .then((transactionsInserted) => {
          expect(transactionsInserted.insertedCount).to.equal(2);

          return request
            .get('/transactions')
            .expect(200)
            .then((res) => {
              const transactions = res.body;

              expect(transactions).to.have.lengthOf(2);
              expect(transactions).to.deep.equal(expected);
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
      const validTransactionPayload = {
        type: 'expense',
        amount: -1567,
        description: 'expense test - insert',
      };

      return request
        .post('/transactions')
        .send(validTransactionPayload)
        .expect(201)
        .then((res) => {
          expect(res.headers).to.include.keys('location');
          expect(res.body)
            .to.deep.equal(Object.assign({}, validTransactionPayload, { _id: res.body._id }));

          return getCollection(collectionName)
            .findOne(validTransactionPayload, { fields: { _id: 0 } })
            .then(transaction => expect(transaction).to.deep.equal(validTransactionPayload));
        });
    });

    it('should return a BadRequest status on invalid payload', () => {
      const invalidTransactionPayload = {
        amount: -1567,
        description: 'expense test - invalid insert',
      };

      return request
        .post('/transactions')
        .send(invalidTransactionPayload)
        .expect(400)
        .then(res => expect(res.body).to.deep.equal({
          message: 'child "type" fails because ["type" is required]',
        }));
    });

    it('should return a single transaction', () => {
      const expected = {
        type: 'expense',
        amount: -1567,
        description: 'expense test',
      };

      return getCollection(collectionName)
        .insertOne(expected)
        .then((insertedTransaction) => {
          expect(insertedTransaction.insertedCount).to.equal(1);

          return request
            .get(`/transactions/${String(expected._id)}`)
            .expect(200)
            .then((res) => {
              expect(res.body)
                .to.deep.equal(Object.assign({}, expected, { _id: String(expected._id) }));
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
      const trasactionToDelele = {
        type: 'expense',
        amount: -1567,
        description: 'expense test',
      };

      return getCollection(collectionName)
        .insertOne(trasactionToDelele)
        .then((insertedTransaction) => {
          expect(insertedTransaction.insertedCount).to.equal(1);

          return request
            .delete(`/transactions/${trasactionToDelele._id}`)
            .expect(204);
        });
    });

    it('should return NotFound when trying to delete a non-existent transaction', () => request
      .delete('/transactions/58b2169e8d51e83a48b0b8d7')
      .expect(404)
      .then(res => expect(res.body).to.deep.equal({
        message: 'transaction not found',
      })));

    it('should update a transaction', () => {
      const transactionToInsert = {
        type: 'expense',
        amount: -1567,
        description: 'expense test - update',
      };

      return getCollection(collectionName)
        .insertOne(transactionToInsert)
        .then((insertedTransaction) => {
          expect(insertedTransaction.insertedCount).to.equal(1);
          const transactionId = String(insertedTransaction.ops[0]._id);

          const validTransactionPayload = {
            type: 'income',
            amount: 1377,
            description: 'expense test - updated',
          };

          return request
            .put(`/transactions/${transactionId}`)
            .send(validTransactionPayload)
            .expect(200)
            .then((res) => {
              expect(res.body)
                .to.deep.equal(Object.assign({}, validTransactionPayload, { _id: transactionId }));

              return getCollection(collectionName)
                .findOne(validTransactionPayload, { fields: { _id: 0 } })
                .then(updatedTransaction => expect(updatedTransaction)
                  .to.deep.equal(validTransactionPayload));
            });
        });
    });

    it('should insert on update a non-existent transaction', () => {
      const transactionId = '58b2169e8d51e83a48b0b8d7';
      const validTransactionPayload = {
        type: 'income',
        amount: 1179,
        description: 'income test - updated',
      };
      const expected = Object.assign({}, validTransactionPayload, { _id: transactionId });

      return request
        .put(`/transactions/${String(transactionId)}`)
        .send(validTransactionPayload)
        .expect(200)
        .then((res) => {
          expect(res.body).to.deep.equal(expected);

          return getCollection(collectionName)
            .findOne(validTransactionPayload)
            .then(actual => expect(Object.assign({}, actual, { _id: String(actual._id) }))
              .to.deep.equal(expected));
        });
    });

    it('should receive BadRequest status when trying to update a transaction with invalid id', () => {
      const invalidTarnsactionId = 'invalidTransactionId';
      const validTransactionPayload = {
        type: 'income',
        amount: 1179,
        description: 'income test - updated',
      };

      return request
        .put(`/transactions/${String(invalidTarnsactionId)}`)
        .send(validTransactionPayload)
        .expect(400)
        .then(res => expect(res.body).to.deep.equal({
          message: 'transaction id must be a string of 24 hex characters',
        }));
    });
  });
});
