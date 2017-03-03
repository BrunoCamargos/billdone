import validateTransaction from '../../src/transactions/transactions-schema';

describe('Unit: ', () => {
  describe('transactions-schema.js', () => {
    describe('.validateTransaction()', () => {
      describe('"amount" field', () => {
        it('should be required', () => {
          const transaction = {
            type: 'expense',
          };

          const result = validateTransaction(transaction);
          expect(result.error).to.be.an('error');
          expect(result.error.message).to.equal('child "amount" fails because ["amount" is required]');
        });

        it('should be an integer', () => {
          const transaction = {
            amount: 15.67,
            type: 'income',
          };

          const result = validateTransaction(transaction);
          expect(result.error).to.be.an('error');
          expect(result.error.message).to.equal('child "amount" fails because ["amount" must be an integer]');
        });

        it('should be a positive number when "type" field is "income"', () => {
          const transaction = {
            amount: -1567,
            type: 'income',
          };

          const result = validateTransaction(transaction);
          expect(result.error).to.be.an('error');
          expect(result.error.message).to.equal('child "amount" fails because ["amount" must be a positive number]');
        });

        it('should be a negative number when "type" field is "expense"', () => {
          const transaction = {
            amount: 1567,
            type: 'expense',
          };

          const result = validateTransaction(transaction);
          expect(result.error).to.be.an('error');
          expect(result.error.message).to.equal('child "amount" fails because ["amount" must be a negative number]');
        });
      });

      describe('"type" field', () => {
        it('should be required', () => {
          const transaction = {
            amount: 1567,
          };

          const result = validateTransaction(transaction);
          expect(result.error).to.be.an('error');
          expect(result.error.message).to.equal('child "type" fails because ["type" is required]');
        });

        it('should only accept "expense" or "income" value', () => {
          const transaction = {
            amount: 1567,
            type: 'invalidType',
          };

          const result = validateTransaction(transaction);
          expect(result.error).to.be.an('error');
          expect(result.error.message).to.equal('child "type" fails because ["type" must be one of [expense, income]]');
        });
      });

      it('should return a valid transaction', () => {
        const transaction = {
          type: 'expense',
          amount: -1567,
          description: 'expense test',
        };

        const result = validateTransaction(transaction);
        expect(result.error).to.be.a('null');
        expect(result.value).to.deep.equal(transaction);
      });
    });
  });
});
