describe('Resources - Transactions', () => {
  it('Should return a list of transactions', (done) => {
    request
      .get('/transactions')
      .end((err, res) => {
        console.log(err);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        done();
      });
  });
});
