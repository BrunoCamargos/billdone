const collectionName = 'transactions';

describe('Integration: ', () => {
  describe('Resources - Transactions', () => {
    beforeEach((done) => {
      getCollection(collectionName).drop()
        .then(() => done())
        .catch(() => done());
    });

    it('Should return a list of transactions', () => {
      const actual = { opa: '99' };

      return getCollection(collectionName).insertOne(actual)
        .then((result) => {
          expect(result.insertedCount).to.equal(1);

          return request
            .get('/transactions')
            .expect(200)
            .then((res) => {
              const transactions = res.body;

              expect(transactions).to.have.lengthOf(1);
              expect(transactions[0].opa).to.equal(actual.opa);
            });
        });
    });

    it('Should insert a transaction', () => {
      const actual = { Opa: '97' };
      return request
        .post('/transactions')
        .send(actual)
        .expect(201)
        .then((res) => {
          const transaction = res.body;

          expect(transaction.Opa).to.equal(actual.Opa);

          return getCollection(collectionName).find().toArray()
            .then((transactions) => {
              expect(transactions).to.have.lengthOf(1);
              expect(transactions[0].Opa).to.equal(actual.Opa);
            });
        });
    });
  });
});
