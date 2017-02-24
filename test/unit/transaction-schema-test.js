import validateTransaction from '../../src/transactions/transaction-schema';

describe('Unit: ', () => {
  describe('transaction-schema.js', () => {
    describe('.validateTransaction()', () => {
      it('"amount" field should be required', () => {
        const transaction = {
          type: 'expense',
        };

        const result = validateTransaction(transaction);
        expect(result.error).to.be.an('error');
        expect(result.error.message).to.equal('child "amount" fails because ["amount" is required]');
      });

      it('"type" field should be required', () => {
        const transaction = {
          amount: 15.67,
        };

        const result = validateTransaction(transaction);
        expect(result.error).to.be.an('error');
        expect(result.error.message).to.equal('child "type" fails because ["type" is required]');
      });

      it('should return a valid transaction', () => {
        const transaction = {
          type: 'expense',
          amount: 1567,
          description: 'expense test',
        };

        const result = validateTransaction(transaction);
        expect(result.error).to.be.a('null');
        expect(result.value).to.deep.equal(transaction);
      });
    });
  });
});
