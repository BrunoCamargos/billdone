describe('Resources - Transactions', () => {
  it('Should return a list of transactions', () => {
    return request
      .get('/transactions')
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({ ok: 'ok' });
      });
  });
});
