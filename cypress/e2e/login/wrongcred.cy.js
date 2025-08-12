describe('Unauthorized', () => {
  it('Can show error message when password is wrong', () => {
  cy.visit('http://127.0.0.1:9080/#/login');
  cy.get("[name='username']").type('admin@jatis.dev');
  cy.get("[name='password']").type('password');
  cy.contains('Masuk').click();
  cy.contains('username dan password tidak cocok').should('exist');
  });
});