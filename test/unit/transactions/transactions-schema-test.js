import validateTransaction from '../../../src/transactions/transactions-schema';

describe('Unit: transactions-schema.js ', () => {
  describe('.validateTransaction()', () => {
    describe('"amount" key', () => {
      it('should be required', () => {
        const transaction = {
          type: 'expense',
        };

        return validateTransaction(transaction)
          .catch(validationError => {
            expect(validationError).to.be.an('error');
            expect(validationError.message).to.equal('child "amount" fails because ["amount" is required]');
          });
      });

      it('should be an integer', () => {
        const transaction = {
          amount: 15.67,
          type: 'income',
        };

        return validateTransaction(transaction)
          .catch(validationError => {
            expect(validationError).to.be.an('error');
            expect(validationError.message).to.equal('child "amount" fails because ["amount" must be an integer]');
          });
      });

      it('should be a positive number when the value of the key "type" is "income"', () => {
        const transaction = {
          amount: -1567,
          type: 'income',
        };

        return validateTransaction(transaction)
          .catch(validationError => {
            expect(validationError).to.be.an('error');
            expect(validationError.message).to.equal('child "amount" fails because ["amount" must be a positive number]');
          });
      });

      it('should be a negative number when the value of the key "type" is "expense"', () => {
        const transaction = {
          amount: 1567,
          type: 'expense',
        };

        return validateTransaction(transaction)
          .catch(validationError => {
            expect(validationError).to.be.an('error');
            expect(validationError.message).to.equal('child "amount" fails because ["amount" must be a negative number]');
          });
      });
    });

    describe('"type" key', () => {
      it('should be required', () => {
        const transaction = {
          amount: 1567,
        };

        return validateTransaction(transaction)
          .catch(validationError => {
            expect(validationError).to.be.an('error');
            expect(validationError.message).to.equal('child "type" fails because ["type" is required]');
          });
      });

      it('should only accept "expense" or "income" value', () => {
        const transaction = {
          amount: 1567,
          type: 'invalidType',
        };

        return validateTransaction(transaction)
          .catch(validationError => {
            expect(validationError).to.be.an('error');
            expect(validationError.message).to.equal('child "type" fails because ["type" must be one of [expense, income]]');
          });
      });
    });

    it('should return a valid transaction', () => {
      const transaction = {
        type: 'expense',
        amount: -1567,
        description: 'expense test',
      };

      return validateTransaction(transaction)
        .then(validTransaction => expect(validTransaction).to.deep.equal(transaction));
    });
  });
});
