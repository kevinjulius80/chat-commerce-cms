describe('Order', () => {
    /*
    it('Get List', () => {
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
        cy.intercept('GET', '/api/orders?&page=1&limit=20&store_id=3&order_status=INITIATED', { fixture: 'orders' });
        cy.intercept('GET', '/api/store/3', { fixture: 'store' });
        cy.intercept('GET', '/api/orders/countstatus/3', { fixture: 'countstatus' });
        cy.intercept('GET', '/api/delivery?page=1&limit=15&name=&merchant_id=1&store_id=3', { fixture: 'delivery' });
        cy.visit('#/order/index');
        cy.intercept('GET', '/api/orders?page=1&limit=20&daterange=&start_date=&end_date=&store_id=&order_status=PAYMENT_CONFIRMED&order_reference_id=&phone_number=&invoice=', { fixture: 'payment_confirmed' });
        cy.get('#PAYMENT_CONFIRMED').click();
        cy.intercept('GET', '/api/orders?&page=1&limit=20&daterange=&start_date=&end_date=&store_id=3&order_status=ACCEPTED&order_reference_id=&phone_number=&invoice=', { fixture: 'accepted' });
        cy.get('#ACCEPTED').click();
        cy.intercept('GET', '/api/orders?&page=1&limit=20&daterange=&start_date=&end_date=&store_id=3&order_status=ON_THE_WAY&order_reference_id=&phone_number=&invoice=', { fixture: 'OnTheWay' });
        cy.get('#ON_THE_WAY').click();
        cy.intercept('GET', '/api/orders?&page=1&limit=20&daterange=&start_date=&end_date=&store_id=3&order_status=SUCCESSFUL&order_reference_id=&phone_number=&invoice=', { fixture: 'successfull' });
        cy.get('#SUCCESSFUL').click();
        cy.intercept('GET', '/api/orders?&page=1&limit=20&daterange=&start_date=&end_date=&store_id=3&order_status=FAILED&order_reference_id=&phone_number=&invoice=', { fixture: 'failed' });
        cy.get('#FAILED').click();
        cy.intercept('GET', '/api/orders?&page=1&limit=20&daterange=&start_date=&end_date=&store_id=3&order_status=REJECTED&order_reference_id=&phone_number=&invoice=', { fixture: 'rejected' });
        cy.get('#REJECTED').click();
    });
    */

    beforeEach(() => {
        cy.visit("http://127.0.0.1:9080")
        cy.get("input[placeholder='Username']").type("admin@jatis.dev")
        cy.get("input[placeholder='password']").type("admin123")
        cy.get("button[type='button']").click()
        cy.wait(7000)
        cy.get('.no-redirect').contains('Dashboard')
        cy.title().should('eq', 'Dashboard - Jessie Dashboard')
        cy.visit("#/order/index")
        cy.wait(7000)
    })

    //afterEach(() => {
    //    cy.get("i[class='el-icon-setting']").click()
    //    cy.get("ul[class='el-dropdown-menu el-popper el-dropdown-menu--medium'] > li:nth-child(2) > span").click()
    //    cy.get("h3.title").contains('Jessie Dashboard')
    //})

    it('Order Menu - Menunggu Pembayaran tab', () => {
        cy.get("table[class='el-table__body']>colgroup>col").should('have.length', '8')
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                //cy.get("table[class='el-table__body']>tbody>tr").should('have.length', 10)
                cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                    cy.wrap($row).within(()=> {
                        cy.get("td:nth-child(2)").each(($col, index, $cols) => {
                               cy.log($col.text()) 
                        })
                    })
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Siap Di Proses', () => {
        cy.get('#PAYMENT_CONFIRMED').click()
        cy.wait(1000)
        cy.get("table[class='el-table__body']>colgroup>col").should('have.length', '9')
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                    cy.wrap($row).within(()=> {
                        cy.get("td:nth-child(2)").each(($col, index, $cols) => {
                               cy.log($col.text()) 
                        })
                    })
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Sedang Disiapkan', () => {
        cy.get('#ACCEPTED').click()
        cy.wait(1000)
        cy.get("table[class='el-table__body']>colgroup>col").should('have.length', '9')
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                //cy.get("table[class='el-table__body']>tbody>tr").should('have.length', 20)
                cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                    cy.wrap($row).within(()=> {
                        cy.get("td:nth-child(2)").each(($col, index, $cols) => {
                               cy.log($col.text()) 
                        })
                    })
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Pesanan Diantar', () => {
        cy.get('#ON_THE_WAY').click()
        cy.wait(1000)
        cy.get("table[class='el-table__body']>colgroup>col").should('have.length', '8')
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                //cy.get("table[class='el-table__body']>tbody>tr").should('have.length', 15)
                cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                    cy.wrap($row).within(()=> {
                        cy.get("td:nth-child(2)").each(($col, index, $cols) => {
                               cy.log($col.text()) 
                        })
                    })
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Pesanan Selesai', () => {
        cy.get('#SUCCESSFUL').click()
        cy.wait(1000)
        cy.get("table[class='el-table__body']>colgroup>col").should('have.length', '8')
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                //cy.get("table[class='el-table__body']>tbody>tr").should('have.length', 20)
                cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                    cy.wrap($row).within(()=> {
                        cy.get("td:nth-child(2)").each(($col, index, $cols) => {
                               cy.log($col.text()) 
                        })
                    })
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Pesanan Gagal', () => {
        cy.get('#FAILED').click()
        cy.wait(1000)
        cy.get("table[class='el-table__body']>colgroup>col").should('have.length', '8')
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                //cy.get("table[class='el-table__body']>tbody>tr").should('have.length', 20)
                cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                    cy.wrap($row).within(()=> {
                        cy.get("td:nth-child(2)").each(($col, index, $cols) => {
                               cy.log($col.text()) 
                        })
                    })
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Pesanan Ditolak', () => {
        cy.get('#REJECTED').click()
        cy.wait(1000)
        cy.get("table[class='el-table__body']>colgroup>col").should('have.length', '8')
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                //cy.get("table[class='el-table__body']>tbody>tr").should('have.length', 20)
                cy.get("table[class='el-table__body']>tbody>tr").each(($row, index, $rows) => {
                    cy.wrap($row).within(()=> {
                        cy.get("td:nth-child(2)").each(($col, index, $cols) => {
                               cy.log($col.text()) 
                        })
                    })
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Search - Order ID', () => {
        cy.get("div[class='order-filter-container'] input[placeholder='Order ID']").type("202302286AN9vIl")
        cy.get("button[class='el-button filter-item-button el-button--primary el-button--medium']").click()
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                cy.get("table[class='el-table__body']>tbody>tr>td:nth-child(2)").contains('202302286AN9vIl')
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Search - WA Pemesan', () => {
        cy.get("div[class='order-filter-container'] input[placeholder='No WA Pemesan']").type("6282213604539")
        cy.get("button[class='el-button filter-item-button el-button--primary el-button--medium']").click()
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                cy.get("table[class='el-table__body']>tbody>tr>td:nth-child(5)").contains('6282213604539')
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Search - Date', () => {
        cy.get("div[class='el-date-editor el-range-editor el-input__inner filter-item-daterange el-date-editor--daterange el-range-editor--medium']").click()
        cy.wait(1000)
        cy.get("div[class='el-picker-panel__body'] > div:nth-child(1) > div:nth-child(1) > button:nth-child(1)").click()
        cy.get("div[class='el-picker-panel__body'] > div:nth-child(1) > div:nth-child(1) > button:nth-child(2)").click()
        cy.get("div[class='el-picker-panel__body'] > div:nth-child(1) > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(1)").click().click()
        cy.get("div[class='el-date-editor el-range-editor el-input__inner filter-item-daterange el-date-editor--daterange el-range-editor--medium']").click()
        cy.get("div[class='el-picker-panel__body'] > div:nth-child(2) > div:nth-child(1) > button:nth-child(1)").click()
        cy.get("div[class='el-picker-panel__body'] > div:nth-child(2) > div:nth-child(1) > button:nth-child(2)").click()
        cy.get("div[class='el-picker-panel__body'] > div:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(1)").click().click()
        cy.wait(1000)
        cy.get("button[class='el-button filter-item-button el-button--primary el-button--medium']").click()
        cy.wait(1000)
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot == 0) {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Detail', () => {
        //table colomn 1
        cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(2)>").contains('202302286AN9vIl')
        //click detail
        cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(8)").click()
        cy.wait(1000)
        cy.get(".el-dialog__title").contains("202302286AN9vIl")
        //close using x
        cy.get("i[class='el-dialog__close el-icon el-icon-close']").click()

        //table colomn 1
        cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(2)").contains('202302286AN9vIl')
        //click detail
        cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(8)").click()
        cy.wait(1000)
        cy.get(".el-dialog__title").contains("202302286AN9vIl")
        //close using OK
        cy.get(".dialog-footer > button:nth-child(2)").click()

        //table colomn 1
        cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(2)").contains('202302286AN9vIl')
    })

    it('Order Menu - Pagination - 1, 2, etc', () => {
        cy.get('#SUCCESSFUL').click() 
        cy.wait(1000)      
        cy.get(".el-pagination__sizes").click()
        cy.get('.el-select-dropdown__item').each(($page) => {
            if ($page.text() == "10/page") {
                cy.wrap($page).click().invoke('text').then((text) => {
                    const a = text.match(/\d+/)[0]
                    cy.get('.el-pagination__total').invoke('text').then((text) => {
                        const b = text.match(/\d+/)[0]
                        let totalPage = (Math.ceil(b/a))
                        for(let p=1; p<=totalPage; p++){
                            if(totalPage>1){
                                cy.log("Active page is === "+ p)
                                cy.get("ul[class='el-pager']>li:nth-child("+p+")").click()
                                cy.wait(500)
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

    it.only('Order Menu - Pagination', () => {
        cy.get('#SUCCESSFUL').click() 
        cy.wait(1000)      
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

    it('Order Menu - Siap Diproses - Accept Order', () => {
        cy.get('#PAYMENT_CONFIRMED').click()
        cy.wait(1000)
        cy.wait(1000)
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(1)").click()
                cy.get("button[class='el-button filter-item-button el-button--success el-button--medium']").click()
                cy.wait(3000)
                cy.get('.el-pagination__total').invoke('text').then((text) => {
                    cy.log(text.match(/\d+/)[0])
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Siap Diproses - Reject Order', () => {
        cy.get('#PAYMENT_CONFIRMED').click()
        cy.wait(1000)
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(1)").click()
                cy.get("button[class='el-button filter-item-button el-button--danger el-button--medium']").click()
                cy.wait(3000)
                cy.get('.el-pagination__total').invoke('text').then((text) => {
                    cy.log(text.match(/\d+/)[0])
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })

    it('Order Menu - Sedang Disiapkan - Multi Order Kurir', () => {
        cy.get('#ACCEPTED').click()
        cy.wait(1000)
        cy.get('.el-pagination__total').invoke('text').then((text) => {
            cy.log(text.match(/\d+/)[0])
            const tot = text.match(/\d+/)[0]
            if ( tot > 0) {
                cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(1)").click()
                cy.get("button[class='el-button filter-item-button el-button--success el-button--medium']").click()
                cy.wait(3000)
                cy.get('.el-pagination__total').invoke('text').then((text) => {
                    cy.log(text.match(/\d+/)[0])
                })
            } else {
                cy.get("span[class='el-table__empty-text']").contains('No Data')
            }
        })
    })
});