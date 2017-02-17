describe('Integration: ', () => {
  describe('Resources - Transactions', () => {
    it('Should return a list of transactions', () => request
      .get('/transactions')
      .expect(200)
      .then((res) => {
        expect(res.body).to.deep.equal([{ _id: '58991c38e8d233f0786cc1b2', ok: 'ok' }]);
      }));
  });
});
