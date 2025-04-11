describe("Navbar Functionality", () => {
    beforeEach(() => {
        cy.session("userSession", () => {
          cy.visit("/auth/login");
          cy.get('input[type="email"]').type("rodrigo.maidana2019@fiuni.edu.py");
          cy.get('input[type="password"]').type("Contraseña123");
          cy.get('button[type="submit"]').click();
          cy.url().should("include", "/dashboard");
        });
        cy.visit("/dashboard");
      });

    it("Crear un post", () => {
        cy.get('a[href="/add-post"]')
        .should('be.visible')
        .find('button')
        .click({ force: true });
      

        cy.url().should('include', '/add-post');

        
    });

});