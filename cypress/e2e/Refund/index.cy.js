describe('Refund', () => {
    /*
    it('Success Render', () => {
        cy.login('admin@jatis.dev', 'jatis.dev');
        cy.login('admin@jatis.dev', 'jatis.dev');
        cy.intercept('GET', '/api/user', { fixture: 'laravel_getuser-success' }).as('getUser-Fixture');
        cy.intercept('GET', '/api/merchants?page=1&limit=9999999999999', { fixture: 'merchant' }).as('getMerchantAndStore-Fixture');
        cy.intercept('GET', '/api/dashboard/3', { fixture: 'dashboard' }).as('getDashboard-Fixture');
        cy.intercept('GET', '/api/stock/countthreshold?store_id=3', { fixture: 'countthreshold' });
        cy.intercept('GET', '/api/stock/countempty?store_id=3', { fixture: 'countempty' }).as('getCountEmpty-Fixture');
        cy.intercept('GET', '/api/stock/countnosales?store_id=3', { fixture: 'countnosales' });
        cy.intercept('GET', '/api/store/3', { fixture: 'store' }).as('getStore-Fixture');
        cy.contains('Masuk').click();
        cy.location('hash').should('eq', '#/dashboard/index');
        cy.intercept('GET', '/api/user', { fixture: 'laravel_getuser-success' }).as('getUser-Fixture');
        cy.intercept('POST', '/api/store-token', { fixture: 'token' });
        cy.intercept('GET', '/api/merchants?page=1&limit=9999999999999', { fixture: 'merchant' }).as('getMerchantAndStore-Fixture');
        cy.intercept('GET', '/api/refund-va?page=1&limit=20&store_id=3', { fixture: 'refund-va' });
        cy.intercept('GET', '/api/store/3', { fixture: 'store' });
        cy.visit('#/refund/index');
        cy.intercept('GET', 'api/refund-ew?page=1&limit=20&invoice=&daterange=&start_date=&end_date=&store_id=3&name=', { fixture: 'refund-ew' });
        cy.contains('E-Wallet').click()
    });
    */
    beforeEach(() => {
        cy.visit("http://jcc-cms.jatismobile.com/")
        cy.get("input[placeholder='Username']").type("admin@jatis.dev")
        cy.get("input[placeholder='password']").type("admin123")
        cy.get("button[type='button']").click()
        //cy.title().should('eq', 'Dashboard - Jessie Dashboard')
        cy.get('.no-redirect').contains('Dashboard')
        cy.visit("#/refund/index")
        cy.wait(3000)
    })

    afterEach(() => {
        cy.get("i[class='el-icon-setting']").click()
        cy.get("ul[class='el-dropdown-menu el-popper el-dropdown-menu--medium'] > li:nth-child(2) > span").click()
        cy.get("h3.title").contains('Jessie Dashboard')
    })

    it('Refund Menu - VA tab', () => {
        cy.get("table[class='el-table__body']>colgroup>col").should('have.length', '7')
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                //cy.get("table[class='el-table__body']>tbody>tr").should('have.length', 20)
                cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                    cy.wrap($row).within(()=> {
                        cy.get("td:nth-child(4)").each(($col, index, $cols) => {
                            cy.log($col.text()) 
                        })
                    })
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Refund Menu - EW tab', () => {
        cy.contains('E-Wallet').click()
        cy.wait(1000)
        cy.get("table[class='el-table__body']>colgroup>col").should('have.length', '7')
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                //cy.get("table[class='el-table__body']>tbody>tr").should('have.length', 20)
                cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                    cy.wrap($row).within(()=> {
                        cy.get("td:nth-child(4)").each(($col, index, $cols) => {
                            cy.log($col.text()) 
                        })
                    })
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Refund Menu - Search - Order ID', () => {
        cy.get("div[class='order-filter-container'] input[placeholder='Order ID']").type("20230418t1nAl3A")
        cy.get("button[class='el-button filter-item el-button--primary el-button--medium']").click()
        cy.wait(1000)
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                cy.get("table[class='el-table__body']>tbody>tr>td:nth-child(2)").contains('20230418t1nAl3A')
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Refund Menu - Search - Nama Pemesan', () => {
        cy.get("div[class='order-filter-container'] input[placeholder='Nama Pemesan']").type("Bento")
        cy.get("button[class='el-button filter-item el-button--primary el-button--medium']").click()
        cy.wait(1000)
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                cy.get("table[class='el-table__body']>tbody>tr>td:nth-child(3)").contains('Bento')
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Search - Date', () => {
        cy.get("div[class='el-date-editor el-range-editor el-input__inner filter-item-daterange el-date-editor--daterange el-range-editor--medium']").click()
        cy.wait(1000)
        //cy.get("div[class='el-picker-panel__body'] > div:nth-child(1) > div:nth-child(1) > button:nth-child(1)").click()
        //cy.get("div[class='el-picker-panel__body'] > div:nth-child(1) > div:nth-child(1) > button:nth-child(2)").click()
        cy.get("div[class='el-picker-panel__body'] > div:nth-child(1) > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(1)").click().click()
        cy.get("div[class='el-date-editor el-range-editor el-input__inner filter-item-daterange el-date-editor--daterange el-range-editor--medium']").click()
        //cy.get("div[class='el-picker-panel__body'] > div:nth-child(2) > div:nth-child(1) > button:nth-child(1)").click()
        //cy.get("div[class='el-picker-panel__body'] > div:nth-child(2) > div:nth-child(1) > button:nth-child(2)").click()
        cy.get("div[class='el-picker-panel__body'] > div:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(1)").click().click()
        cy.wait(1000)
        cy.get("button[class='el-button filter-item el-button--primary el-button--medium']").click()
        cy.wait(1000)
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot == 0) {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Refund Menu - Detail', () => {
        //table colomn 1
        cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(2)").contains('20230418t1nAl3A')
        //click detail
        cy.get("table[class='el-table__body']>tbody:nth-child(2)>tr:nth-child(1)>td:nth-child(7)>div:nth-child(1)>button:nth-child(1)").click()
        cy.wait(1000)
        cy.get(".el-dialog__title").contains("20230418t1nAl3A")
        //close using x
        cy.get("i[class='el-dialog__close el-icon el-icon-close']").click()

        //table colomn 1
        cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(2)").contains('20230418t1nAl3A')
        //click detail
        cy.get("table[class='el-table__body']>tbody:nth-child(2)>tr:nth-child(1)>td:nth-child(7)>div:nth-child(1)>button:nth-child(1)").click()
        cy.wait(1000)
        cy.get(".el-dialog__title").contains("20230418t1nAl3A")
        //close using OK
        cy.get(".dialog-footer > button:nth-child(2)").click()

        //table colomn 1
        cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(2)").contains('20230418t1nAl3A')
    })

    it('Refund Menu - Pagination', () => {       
        cy.get(".el-pagination__sizes").click()
        cy.get('.el-select-dropdown__item').each(($page) => {
            if ($page.text() == "10/page") {
                cy.wrap($page).click().invoke('text')
                .then((text) => {
                    const a = text.match(/\d+/)[0]
                    cy.get('.el-pagination__total').invoke('text')
                    .then((text) => {
                        const b = text.match(/\d+/)[0]
                        let totalPage = (Math.ceil(b/a))
                        for(let p=1; p<=totalPage; p++){
                            if(totalPage>1){
                                cy.log("Active page is === "+ p)
                                cy.get("ul[class='el-pager']>li:nth-child("+p+")").click()
                                cy.wait(1000)
                                cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                                    cy.wrap($row).within(() => {
                                        cy.get('td:nth-child(1)').then((e) => {
                                            cy.log(e.text())
                                        })
                                    })
                                })
                            }
                        }
                    })
                })
            }
        })
    })

    it.only('Refund Menu - Pagination', () => {
        cy.get(".el-pagination__sizes").click()
        cy.get('.el-select-dropdown__item').each(($page) => {
            if ($page.text() == "10/page") {
                cy.wrap($page).click().invoke('text').then((text) => {
                    const a = text.match(/\d+/)[0]
                    cy.get('.el-pagination__total').invoke('text').then((text) => {
                        const b = text.match(/\d+/)[0]
                        let totalPage = (Math.ceil(b/a))
                        if(totalPage>1){
                            cy.get("button[class='btn-next']").click()
                            cy.wait(100)
                            cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                                 cy.wrap($row).within(() => {
                                    cy.get('td:nth-child(1)').then((e) => {
                                        cy.log(e.text())
                                    })
                                })
                            })
                            cy.get("button[class='btn-prev']").click()
                            cy.wait(100)
                            cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                                cy.wrap($row).within(() => {
                                    cy.get('td:nth-child(1)').then((e) => {
                                        cy.log(e.text())
                                    })
                                })
                            })
                            cy.get("input[type='number']").clear().type('2').type('{enter}')
                            cy.wait(100)
                            cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                                cy.wrap($row).within(() => {
                                    cy.get('td:nth-child(1)').then((e) => {
                                        cy.log(e.text())
                                    })
                                })
                            })
                        }
                        
                    })
                })
            }
        })
    })

})
