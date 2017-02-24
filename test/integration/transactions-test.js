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
      const actual = {
        type: 'expense',
        amount: 1567,
        description: 'expense test',
      };

      return request
        .post('/transactions')
        .send(actual)
        .expect(201)
        .then((res) => {
          expect(res.headers).to.include.keys('location');
          expect(res.body.Opa).to.equal(actual.Opa);

          // TODO: passar para findOne
          return getCollection(collectionName).find().toArray()
            .then((transactions) => {
              expect(transactions).to.have.lengthOf(1);

              const expected = transactions[0];
              delete expected._id;

              expect(expected).to.deep.equal(actual);
            });
        });
    });
  });
});
