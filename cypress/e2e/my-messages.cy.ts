describe("Enviar un mensaje al primer chat. ", () => {
    it("Debería iniciar sesión, ir a chats, y buscar un usuario y enviar un mensaje.", () => {

    // 1. Login con credenciales válidas de admin
      cy.visit("/auth/login");
      cy.get('input[name="email"]').type("rodrigo.maidana2019@fiuni.edu.py", { delay: 100 });
      cy.get('input[name="password"]').type("Rodrigo29", { delay: 100 });
      cy.get('button[type="submit"]').click();
  
      cy.wait(7000);
      cy.url().should("include", "/dashboard");

      cy.get('#message-circle').click();

      cy.contains('a', 'Ver todos los mensajes').click();

      cy.wait(7000);
      cy.url().should('include', '/chats');

      cy.get('#search-contact-input').type('William');

      cy.get('div').contains('William').click();

      cy.get('#message-content-input')
        .type('Hola, este es un mensaje de prueba con Cypress. Ya debe funcionar correctamente.');

      cy.get('button[type="submit"]').should('not.be.disabled').click();

    })})