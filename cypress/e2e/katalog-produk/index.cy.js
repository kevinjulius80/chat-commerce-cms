import 'cypress-file-upload'

describe('Katalog', () => {
    //it('Success Render', () => {
    //    cy.login('admin@jatis.dev', 'jatis.dev');
    //    cy.intercept('GET', '/api/user', { fixture: 'laravel_getuser-success' }).as('getUser-Fixture');
    //    cy.intercept('GET', '/api/merchants?page=1&limit=9999999999999', { fixture: 'merchant' }).as('getMerchantAndStore-Fixture');
    //    cy.intercept('GET', '/api/dashboard/3', { fixture: 'dashboard' }).as('getDashboard-Fixture');
    //    cy.intercept('GET', Cypress.env('BACKEND_API_URL') + '/a/stock/countempty?store_id=3', { fixture: 'countempty' }).as('getCountEmpty-Fixture');
    //    cy.intercept('GET', '/api/store/3', { fixture: 'store' }).as('getStore-Fixture');
    //    cy.contains('Masuk').click();
    //    cy.location('hash').should('eq', '#/dashboard/index');
    //    cy.intercept('GET', '/api/category?merchant_id=1&page=1&limit=999999999999&store_id=3', { fixture: 'category' });
    //    cy.intercept('GET', '/api/menu?page=1&merchant_id=1&limit=15&name=&store_id=3', { fixture: 'stockgetsetting' });
    //    cy.visit('#/store/menu');
    //    cy.contains('Tambah').click(); 
    //    cy.wait(100);
    //    cy.get('#addMenu').should('be.visible');
    //    cy.wait(100);
    //    cy.get("[name='name']").type('Fruit Tea');
    //    cy.get("[name='category_id']").type('jatis.dev');
    //    cy.get("[name='short_desc']").type('Fruit Tea');
    //    cy.get("[name='description']").type('Fruit Tea');
    //    cy.get("#img").selectFile(['images.jpeg'])
    //    cy.intercept('POST', '/api/menu', { fixture: 'menu' });
    //    cy.get('ok').click();
    //});

    beforeEach(() => {
        cy.visit("http://jcc-cms.jatismobile.com/")
        cy.get("input[placeholder='Username']").type("admin@jatis.dev")
        cy.get("input[placeholder='password']").type("admin123")
        cy.get("button[type='button']").click()
        cy.wait(700)
        cy.get('.no-redirect').contains('Dashboard')
        cy.title().should('eq', 'Dashboard - Jessie Dashboard')
        cy.visit("#/store/menu")
        cy.wait(700)
    })

    //afterEach(() => {
    //    cy.get("i[class='el-icon-setting']").click()
    //    cy.get("ul[class='el-dropdown-menu el-popper el-dropdown-menu--medium'] > li:nth-child(2) > span").click()
    //    cy.get("h3.title").contains('Jessie Dashboard')
    //})


    it('Setting Menu - Katalog Produk', () => {
        cy.get("table[class='el-table__body']>colgroup>col").should('have.length', '9')
        //cy.get("table[class='el-table__body']>tbody>tr").should('have.length', '15')
        cy.get("table[class='el-table__body']>tbody>tr")
            .each(($row, index, $rows) => {
                cy.wrap($row).within(()=> {
                    cy.get("td:nth-child(5)").each(($col, index, $cols) => {
                       cy.log($col.text()) 
                    })
                })
            })
    })

    it('Setting Menu - Katalog Produk - Search - Kata Kunci', () => {
        cy.get("div[class='filter-item-search el-input el-input--medium'] input[placeholder='Kata Kunci']").type("Aqua")
        cy.get("div[class='filter-item-button'] > button:nth-child(2)").click()
        cy.get("table[class='el-table__body']>tbody>tr>td:nth-child(4)").contains('Aqua')
    })

    it('Setting Menu - Katalog Produk - Search - Kategori', () => {
        cy.get("div[class='filter-item-wrapper'] > div:nth-child(2)").click()
        cy.contains('Frozen Product').click()
        cy.get("table[class='el-table__body']>tbody>tr>td:nth-child(5)").contains('Frozen Product')
    })

    it('Setting Menu - Katalog Produk - Search - Status', () => {
        cy.get("div[class='filter-item-wrapper'] > div:nth-child(3)").click()
        cy.contains('Aktif').click()
        cy.get("table[class='el-table__body']>tbody>tr>td:nth-child(8)>div:nth-child(1)>div:nth-child(1)>span")
          .should('have.css', 'background-color', 'rgb(19, 206, 102)')
    })

    it('Setting Menu - Katalog Produk - Liat Detail Produk', () => {
        cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(9)>div[class='cell']>button:nth-child(1)").click()
        cy.get("div[aria-label='Detail Produk'] > div:nth-child(1)").contains('Detail Produk')
        cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(1)>div[class='cell']").contains('Nama')
        cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(2)>td:nth-child(1)>div[class='cell']").contains('Kategori')
        cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(3)>td:nth-child(1)>div[class='cell']").contains('Deskripsi Singkat')
        cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(4)>td:nth-child(1)>div[class='cell']").contains('Deskripsi Detail')
        cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(5)>td:nth-child(1)>div[class='cell']").contains('Status')
        cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(6)>td:nth-child(1)>div[class='cell']").contains('Gambar')
        // cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(7)>td:nth-child(1)>div[class='cell']").contains('Harga')
        // cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(8)>td:nth-child(1)>div[class='cell']").contains('Stok')
        // cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(9)>td:nth-child(1)>div[class='cell']").contains('Panjang (cm)')
        // cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(10)>td:nth-child(1)>div[class='cell']").contains('Tinggi (cm)')
        // cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(11)>td:nth-child(1)>div[class='cell']").contains('Lebar (cm)')
        // cy.get("div[aria-label='Detail Produk'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table[class='el-table__body']>tbody>tr:nth-child(12)>td:nth-child(1)>div[class='cell']").contains('Berat (cm)')
    })

    it('Setting Menu - Katalog Produk - Liat Delete Produk', () => {
        cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(9)>div[class='cell']>button:nth-child(3)").click()
        cy.get("div[aria-label='Peringatan'] > div[class='el-message-box'] > div:nth-child(1) > div:nth-child(1)").contains('Peringatan')
        // Batal dengan silang
        // cy.get("div[aria-label='Peringatan'] > div[class='el-message-box'] > div:nth-child(1) > button > i").click()
        cy.get("div[aria-label='Peringatan'] > div[class='el-message-box'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p").contains('Ini akan menghapus menu Coca Cola. Lanjutkan?')
        // Batal dengan tombol batal
        //cy.get("div[aria-label='Peringatan'] > div[class='el-message-box'] > div:nth-child(3) > button:nth-child(1)").click()
        // Hapus dengan tombol ok
        //cy.get("div[aria-label='Peringatan'] > div[class='el-message-box'] > div:nth-child(3) > button:nth-child(2)").click()
    })

    it.only('Setting Menu - Katalog Produk - Update Produk', () => {
        cy.get("table[class='el-table__body']>tbody>tr:nth-child(1)>td:nth-child(9)>div[class='cell']>button:nth-child(2)").click()
        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(1)").contains('Ubah Menu')
        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(1) > label").contains('Nama')
        // cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input").type("judul")
        
        //Kategori
        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(2) > label").contains('Kategori')
        //cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)").click()
        //cy.get("div[class='el-select-dropdown el-popper'] > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(1)").last().click()
    
        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(3) > label").contains('Deskripsi Singkat')
        //cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > textarea").type("deskripsi singkat")
        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > label").contains('Deskripsi Detail')
        //cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > textarea").type("deskripsi detail")
    
        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(5) > label").contains('Gambar')
        //cy.get('input[type="file"]').invoke('show'); 
        //cy.get('input[type="file"]').attachFile({filePath:'aqua.jpeg'})

        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(6) > label").contains('Status')
        //cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(6) > div:nth-child(2) > div:nth-child(1)")
        //.invoke('addClass', 'is-checked')
        //.should('have.class', 'is-checked')

        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(7) > label").contains('Harga')
        //cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > input").clear().type("1000")

        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(8) > label").contains('Stok')
        //cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(8) > div:nth-child(2) > div:nth-child(1) > input").clear().type("8")
        
        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(9) > label").contains('Panjang (cm)')
        //cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(9) > div:nth-child(2) > div:nth-child(1) > input").clear().type("9")
        
        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(10) > label").contains('Tinggi (cm)')
        //cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(10) > div:nth-child(2) > div:nth-child(1) > input").clear().type("10")
        
        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(11) > label").contains('Lebar (cm)')
        // cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(11) > div:nth-child(2) > div:nth-child(1) > input").clear().type("11")

        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(12) > label").contains('Berat (g)')
        // cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(12) > div:nth-child(2) > div:nth-child(1) > input").clear().type("12")   
        
        // Ok
        // cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(2) > span").click()

        // Batal
        cy.get("div[aria-label='Ubah Menu'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1) > span").click()
    })

    it('Setting Menu - Katalog Produk - Tambah Produk', () => {
        cy.get("div[class='action-add-button'] > button:nth-child(1)").click()
        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(1)").contains('Tambah Produk Baru')
        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input").type("judul")
        
        //kategori
        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)").click()
        cy.get("div[class='el-select-dropdown el-popper'] > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(1)").last().click()

        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > textarea").type("deskripsi singkat")
        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > textarea").type("deskripsi detail")
        
        //image
        cy.get('input[type="file"]').invoke('show'); 
        cy.get('input[type="file"]').attachFile({filePath:'aqua.jpeg'})

        //status
        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(6) > div:nth-child(2) > div:nth-child(1)")
        .invoke('addClass', 'is-checked')
        .should('have.class', 'is-checked')

        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > input").clear().type("1000")
        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(8) > div:nth-child(2) > div:nth-child(1) > input").clear().type("8")
        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(9) > div:nth-child(2) > div:nth-child(1) > input").clear().type("9")
        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(10) > div:nth-child(2) > div:nth-child(1) > input").clear().type("10")
        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(11) > div:nth-child(2) > div:nth-child(1) > input").clear().type("11")
        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(12) > div:nth-child(2) > div:nth-child(1) > input").clear().type("12")
        
        cy.get("div[aria-label='Tambah Produk Baru'] > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(2) > span").click()
    })
});
