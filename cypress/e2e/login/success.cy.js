describe('Success Login', () => {
  it('Redirect to dashboard', () => {
  cy.visit(Cypress.env('APP_URL') + '/#/login');
  cy.get("[name='username']").type('admin@jatis.dev');
  cy.get("[name='password']").type('jatis.dev');
  cy.intercept('POST', Cypress.env('AUTH_API_URL') + '/login', { fixture: 'auth_service-success' }).as('loginAuthService-Fixture');
  cy.intercept('POST', '/api/auth/login', { fixture: 'laravel_auth-success' }).as('loginLaravel-Fixture');
  cy.intercept('GET', '/api/user', { fixture: 'laravel_getuser-success' }).as('getUser-Fixture');
  cy.intercept('GET', '/api/merchants?page=1&limit=9999999999999', { fixture: 'merchant' }).as('getMerchantAndStore-Fixture');
  cy.intercept('GET', '/api/dashboard/3', { fixture: 'dashboard' }).as('getDashboard-Fixture');
  cy.intercept('GET', Cypress.env('BACKEND_API_URL') + '/a/stock/countempty?store_id=3', { fixture: 'countempty' }).as('getCountEmpty-Fixture');
  cy.intercept('GET', '/api/store/3', { fixture: 'store' }).as('getStore-Fixture');
  cy.contains('Masuk').click();
  cy.location('hash').should('eq', '#/dashboard/index');
  });
});