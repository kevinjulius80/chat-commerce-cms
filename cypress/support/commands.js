/* eslint-disable indent */
/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, pw) => {
    cy.visit(Cypress.env('APP_URL') + '/#/login');
    cy.get("[name='username']").type(email);
    cy.get("[name='password']").type(pw);
    cy.intercept('POST', '/api/auth-service/login', { fixture: 'auth_service-success' }).as('loginAuthService-Fixture');
    cy.intercept('POST', '/api/auth/login', { fixture: 'laravel_auth-success' }).as('loginLaravel-Fixture');
});
