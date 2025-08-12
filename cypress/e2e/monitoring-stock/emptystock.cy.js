/* eslint-disable no-undef */
/* eslint-disable indent */
describe('Empty Stock', () => {
    it('Success Render', () => {
        cy.login('admin@jatis.test', 'jatis.dev');
        cy.intercept('GET', '/api/user', { fixture: 'laravel_getuser-success' }).as('getUser-Fixture');
        cy.intercept('GET', '/api/merchants?page=1&limit=9999999999999', { fixture: 'merchant' }).as('getMerchantAndStore-Fixture');
        cy.intercept('GET', '/api/dashboard/3', { fixture: 'dashboard' }).as('getDashboard-Fixture');
        cy.intercept('GET', '/api/stock/countempty?store_id=3', { fixture: 'countempty' }).as('getCountEmpty-Fixture');
        cy.intercept('GET', '/api/stock/countthreshold?store_id=3', { fixture: 'countthreshold' });
        cy.intercept('GET', '/api/stock/countnosales?store_id=3', { fixture: 'countnosales' });
        cy.intercept('GET', '/api/store/3', { fixture: 'store' }).as('getStore-Fixture');
        cy.contains('Masuk').click();
        cy.location('hash').should('eq', '#/dashboard/index');
        cy.get('.monitoring-stock-container > h4').contains('Monitoring Stok');
        cy.get('.stock > .card-panel-col--1 > .card-panel').contains('Stok Habis');
        cy.get('#hamburger-container').click();
        cy.wait(100);
        cy.contains('Monitoring Stok').click();
        cy.wait(100);
        cy.contains('Kehabisan Stok').click();
        cy.location('hash').should('eq', '#/stock/empty');
        cy.intercept('GET', '/api/category?merchant_id=1&page=1&limit=999999999999&store_id=3', { fixture: 'category' }).as('getCategory-Fixture');
        cy.intercept('GET', '/api/stock/empty?page=1&merchant_id=1&limit=15&name=&store_id=3', { fixture: 'stockempty' }).as('getStockEmpty-Fixture');
        cy.contains('ID');
        cy.contains('Gambar');
        cy.contains('Nama');
        cy.contains('Kategori');
        cy.contains('Stok');
        cy.contains('Status');
        cy.contains('Aksi');
    });

    // 400/500, no logout
    it('Empty Stock API return 400', () => {
        cy.login('admin@jatis.dev', 'jatis.dev');
        cy.intercept('GET', '/api/user', { fixture: 'laravel_getuser-success' }).as('getUser-Fixture');
        cy.intercept('GET', '/api/merchants?page=1&limit=9999999999999', { fixture: 'merchant' }).as('getMerchantAndStore-Fixture');
        cy.intercept('GET', '/api/dashboard/3', { fixture: 'dashboard' }).as('getDashboard-Fixture');
        cy.intercept('GET', '/api/stock/countempty?store_id=3', { fixture: 'countempty' }).as('getCountEmpty-Fixture');
        cy.intercept('GET', '/api/stock/countthreshold?store_id=3', { fixture: 'countthreshold' });
        cy.intercept('GET', '/api/stock/countnosales?store_id=3', { fixture: 'countnosales' });
        cy.intercept('GET', '/api/store/3', { fixture: 'store' }).as('getStore-Fixture');
        cy.contains('Masuk').click();
        cy.location('hash').should('eq', '#/dashboard/index');
        cy.contains('Stok Habis').click();
        cy.location('hash').should('eq', '#/stock/empty');
        cy.intercept('GET', '/api/category?merchant_id=1&page=1&limit=999999999999&store_id=3', { fixture: 'category' }).as('getCategory-Fixture');
        cy.intercept('GET', '/api/stock/empty?page=1&merchant_id=1&limit=15&name=&store_id=3', {
            statusCode: 400,
            body: {
                success: false,
                error: 'Bad request',
            },
        }).as('getStockEmpty-Fixture');
        cy.contains('No Data');
    });

    // 401, must logout
    it('Empty Stock API return 401', () => {
        cy.login('admin@jatis.dev', 'jatis.dev');
        cy.intercept('GET', '/api/user', { fixture: 'laravel_getuser-success' }).as('getUser-Fixture');
        cy.intercept('GET', '/api/merchants?page=1&limit=9999999999999', { fixture: 'merchant' }).as('getMerchantAndStore-Fixture');
        cy.intercept('GET', '/api/dashboard/3', { fixture: 'dashboard' }).as('getDashboard-Fixture');
        cy.intercept('GET', '/api/stock/countempty?store_id=3', { fixture: 'countempty' }).as('getCountEmpty-Fixture');
        cy.intercept('GET', '/api/stock/countthreshold?store_id=3', { fixture: 'countthreshold' });
        cy.intercept('GET', '/api/stock/countnosales?store_id=3', { fixture: 'countnosales' });
        cy.intercept('GET', '/api/store/3', { fixture: 'store' }).as('getStore-Fixture');
        cy.contains('Masuk').click();
        cy.location('hash').should('eq', '#/dashboard/index');
        cy.contains('Stok Habis').click();
        cy.location('hash').should('eq', '#/stock/empty');
        cy.intercept('GET', '/api/category?merchant_id=1&page=1&limit=999999999999&store_id=3', { fixture: 'category' }).as('getCategory-Fixture');
        cy.intercept('GET', '/api/stock/empty?page=1&merchant_id=1&limit=15&name=&store_id=3', {
            statusCode: 401,
            body: {
                success: false,
                error: 'Unauthorized',
            },
        }).as('getStockEmpty-Fixture');
        cy.wait(500);
        cy.location('hash').should('eq', '#/login?redirect=%2Fstock%2Fempty');
    });
});
