import config from '../../src/commons/config';

const collectionName = 'transactions';
const transactionsResource = '/transactions';

const assertInvalidId = res => expect(res.body).to.deep.equal({
  message: 'transaction id must be a string of 24 hex characters',
});

describe('Integration: ', () => {
  describe('Resources - Transactions', () => {
    beforeEach((done) => {
      getCollection(collectionName)
        .drop()
        .then(() => done())
        .catch(() => done());
    });

    describe('List Transactions', () => {
      const transactionsToInsert = [{
        type: 'expense',
        amount: -1567,
        description: 'expense test - 1',
        _id: 1,
      }, {
        type: 'income',
        amount: 1678,
        description: 'income test - 2',
        _id: 2,
      }, {
        type: 'expense',
        amount: -1133,
        description: 'expense test - 3',
        _id: 3,
      }, {
        type: 'expense',
        amount: -933,
        description: 'expense test - 4',
        _id: 4,
      }, {
        type: 'expense',
        amount: -1933,
        description: 'expense test - 5',
        _id: 5,
      }];

      it('should return the first page with 2 transactions', () => getCollection(collectionName)
          .insertMany(transactionsToInsert)
          .then((transactionsInserted) => {
            expect(transactionsInserted.insertedCount).to.equal(5);

            return request
              .get(`${transactionsResource}/?page=1&limit=2`)
              .expect(200)
              .then((res) => {
                const transactions = res.body;
                const expected = transactionsToInsert.slice(0, 2);

                expect(transactions).to.have.lengthOf(2);
                expect(transactions).to.deep.equal(expected);
              });
          }));

      it('should return the second page with 2 transactions', () => getCollection(collectionName)
          .insertMany(transactionsToInsert)
          .then((transactionsInserted) => {
            expect(transactionsInserted.insertedCount).to.equal(5);

            return request
              .get(`${transactionsResource}/?page=2&limit=2`)
              .expect(200)
              .then((res) => {
                const transactions = res.body;
                const expected = transactionsToInsert.slice(2, 4);

                expect(transactions).to.have.lengthOf(2);
                expect(transactions).to.deep.equal(expected);
              });
          }));

      it('should return 3 transactions - max page size defined', () => getCollection(collectionName)
          .insertMany(transactionsToInsert)
          .then((transactionsInserted) => {
            expect(transactionsInserted.insertedCount).to.equal(5);

            config.app.defaultPageLimit = 3;
            return request
              .get(`${transactionsResource}/?page=1&limit=130`)
              .expect(200)
              .then((res) => {
                const transactions = res.body;
                const expected = transactionsToInsert.slice(0, 3);

                expect(transactions).to.have.lengthOf(3);
                expect(transactions).to.deep.equal(expected);
              });
          }));

      it('should not accept mime type other than application/json', () => request
        .get(transactionsResource)
        .set('Accept', 'text/html')
        .expect(406)
        .then(res => expect(res.body).to.deep.equal({
          message: 'type text/html is not acceptable, try changing to application/json',
        })));

      it('should accept mime type application/json', () => request
        .get(transactionsResource)
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => expect(res.body).to.have.lengthOf(0)));
    });

    describe('Insert a single Transaction', () => {
      it('should insert a transaction', () => {
        const validTransactionPayload = {
          type: 'expense',
          amount: -1567,
          description: 'expense test - insert',
        };

        return request
          .post(transactionsResource)
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

      it('should return a BadRequest when trying to insert an invalid transaction', () => {
        const invalidTransactionPayload = {
          amount: -1567,
          description: 'expense test - invalid insert',
        };

        return request
          .post(transactionsResource)
          .send(invalidTransactionPayload)
          .expect(400)
          .then(res => expect(res.body).to.deep.equal({
            message: 'child "type" fails because ["type" is required]',
          }));
      });
    });

    describe('Get a single Transaction', () => {
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
              .get(`${transactionsResource}/${String(expected._id)}`)
              .expect(200)
              .then((res) => {
                expect(res.body)
                  .to.deep.equal(Object.assign({}, expected, { _id: String(expected._id) }));
              });
          });
      });

      it('should return BadRequest when trying to get an invalid transaction', () => request
        .get(`${transactionsResource}/invalidTransactionId`)
        .expect(400)
        .then(assertInvalidId));

      it('should return BadRequest when trying to get a non-existent transaction', () => request
        .get(`${transactionsResource}/58b2169e8d51e83a48b0b8d7`)
        .expect(404)
        .then(res => expect(res.body).to.deep.equal({
          message: 'transaction not found',
        })));
    });

    describe('Delete a single Transaction', () => {
      it('should delete a transaction', () => {
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
              .delete(`${transactionsResource}/${trasactionToDelele._id}`)
              .expect(204);
          });
      });

      it('should return BadRequest when trying to delete an invalid transaction', () => request
        .delete(`${transactionsResource}/invalidTransactionId`)
        .expect(400)
        .then(assertInvalidId));

      it('should return NotFound when trying to delete a non-existent transaction', () => request
        .delete(`${transactionsResource}/58b2169e8d51e83a48b0b8d7`)
        .expect(404)
        .then(res => expect(res.body).to.deep.equal({
          message: 'transaction not found',
        })));
    });

    describe('Delete a single Transaction', () => {
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
              .put(`${transactionsResource}/${transactionId}`)
              .send(validTransactionPayload)
              .expect(200)
              .then((res) => {
                expect(res.body).to.deep
                  .equal(Object.assign({}, validTransactionPayload, { _id: transactionId }));

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
          .put(`${transactionsResource}/${String(transactionId)}`)
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

      it('should return BadRequest when trying to update a transaction with invalid id', () => {
        const invalidTarnsactionId = 'invalidTransactionId';
        const validTransactionPayload = {
          type: 'income',
          amount: 1179,
          description: 'income test - updated',
        };

        return request
          .put(`${transactionsResource}/${String(invalidTarnsactionId)}`)
          .send(validTransactionPayload)
          .expect(400)
          .then(assertInvalidId);
      });
    });
  });
});
