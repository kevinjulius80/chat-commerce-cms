/* eslint-disable no-undef */
/* eslint-disable indent */
describe('Setting Monitoring Stock', () => {
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
        cy.get('#hamburger-container').click();
        cy.wait(100);
        cy.contains('Monitoring Stok').click();
        cy.wait(100);
        cy.intercept('GET', '/api/stock/setting?store_id=3', { fixture: 'stockgetsetting' });
        cy.contains('Pengaturan Stok').click();
        cy.location('hash').should('eq', '#/stock/setting');
        cy.contains('Threshold');
        cy.contains('Periode');
        cy.get('.el-button--default').should('be.disabled');
        cy.get('.el-button--primary').should('be.disabled');
    });

    it('Bad Request Render', () => {
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
        cy.get('#hamburger-container').click();
        cy.wait(100);
        cy.contains('Monitoring Stok').click();
        cy.wait(100);
        cy.intercept('GET', '/api/stock/setting?store_id=3', {
            statusCode: 400,
            body: {
                success: false,
                error: 'Bad Request',
            },
         });
        cy.contains('Pengaturan Stok').click();
        cy.location('hash').should('eq', '#/stock/setting');
    });

    it('Unauthorized Render', () => {
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
        cy.get('#hamburger-container').click();
        cy.wait(100);
        cy.contains('Monitoring Stok').click();
        cy.wait(100);
        cy.intercept('GET', '/api/stock/setting?store_id=3', {
            statusCode: 401,
            body: {
                success: false,
                error: 'Unauthorized',
            },
         });
        cy.contains('Pengaturan Stok').click();
        cy.location('hash').should('eq', '#/stock/setting');
        cy.location('hash').should('eq', '#/login?redirect=%2Fstock%2Fsetting');
    });

    it('Cancel Edit', () => {
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
        cy.get('#hamburger-container').click();
        cy.wait(100);
        cy.contains('Monitoring Stok').click();
        cy.wait(100);
        cy.intercept('GET', '/api/stock/setting?store_id=3', { fixture: 'stockgetsetting' });
        cy.contains('Pengaturan Stok').click();
        cy.location('hash').should('eq', '#/stock/setting');
        cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').type('1');
        cy.get(':nth-child(2) > .el-form-item__content > .el-input > .el-input__inner').type('2');
        cy.get('.el-button--default').click();
        cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').should('have.value', '10');
        cy.get(':nth-child(2) > .el-form-item__content > .el-input > .el-input__inner').should('have.value', '30');
    });

    it('Success Edit', () => {
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
        cy.get('#hamburger-container').click();
        cy.wait(100);
        cy.contains('Monitoring Stok').click();
        cy.wait(100);
        cy.intercept('GET', '/api/stock/setting?store_id=3', { fixture: 'stockgetsetting' });
        cy.contains('Pengaturan Stok').click();
        cy.location('hash').should('eq', '#/stock/setting');
        cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').type('1');
        cy.intercept('POST', '/api/stock/setting', { fixture: 'stocksetsetting' });
        cy.get('.el-button--primary').click();
    });

    it('Bad Request Edit', () => {
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
        cy.get('#hamburger-container').click();
        cy.wait(100);
        cy.contains('Monitoring Stok').click();
        cy.wait(100);
        cy.intercept('GET', '/api/stock/setting?store_id=3', { fixture: 'stockgetsetting' });
        cy.contains('Pengaturan Stok').click();
        cy.location('hash').should('eq', '#/stock/setting');
        cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').type('1');
        cy.intercept('POST', '/api/stock/setting', {
            statusCode: 400,
            body: {
                success: false,
                error: 'Bad Request',
            },
         });
        cy.get('.el-button--primary').click();
    });

    it('Unauthorized Edit', () => {
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
        cy.get('#hamburger-container').click();
        cy.wait(100);
        cy.contains('Monitoring Stok').click();
        cy.wait(100);
        cy.intercept('GET', '/api/stock/setting?store_id=3', { fixture: 'stockgetsetting' });
        cy.contains('Pengaturan Stok').click();
        cy.location('hash').should('eq', '#/stock/setting');
        cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').type('1');
        cy.intercept('POST', '/api/stock/setting', {
            statusCode: 401,
            body: {
                success: false,
                error: 'Unauthorized',
            },
         });
        cy.get('.el-button--primary').click();
        cy.location('hash').should('eq', '#/login?redirect=%2Fstock%2Fsetting');
    });
});
