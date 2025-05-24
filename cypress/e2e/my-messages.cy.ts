describe("Enviar un mensaje al primer chat. ", () => {
    it("Debería iniciar sesión, ir a chats, y buscar un usuario y enviar un mensaje.", () => {

    // 1. Login con credenciales válidas de admin
      cy.visit("/auth/login");
      cy.get('input[name="email"]').type("rodrigo.maidana2019@fiuni.edu.py", { delay: 100 });
      cy.get('input[name="password"]').type("Rodrigo29", { delay: 100 });
      cy.get('button[type="submit"]').click();
  
      cy.wait(7000);
      cy.url().should("include", "/dashboard");

      cy.get('svg.lucide-message-circle').parents('button').click();

      cy.contains('a', 'Ver todos los mensajes').click();

      cy.wait(7000);
      cy.url().should('include', '/chats');

      cy.get('input[placeholder="Buscar conversación..."]').type('William', { force: true });

      cy.get('div').contains('William').click();

      cy.get('input[placeholder="Escribe un mensaje..."]')
        .type('Hola, este es un mensaje de prueba con Cypress.');

      cy.get('button[type="submit"]').should('not.be.disabled');

      cy.get('button[type="submit"]').click();
    })})