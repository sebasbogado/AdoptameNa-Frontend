describe("Admin Panel - Ver detalle de un producto - TC-ADMIN-01", () => {
    it("Debería iniciar sesión, buscar el primer card de la tienda y ver su detalle, verificando que se muestre el precio.", () => {

    // 1. Login con credenciales válidas de admin
      cy.visit("/auth/login");
      cy.get('input[name="email"]').type("rodrigo.maidana2019@fiuni.edu.py", { delay: 100 });
      cy.get('input[name="password"]').type("Rodrigo29", { delay: 100 });
      cy.get('button[type="submit"]').click();
  
      cy.wait(7000);
      cy.url().should("include", "/dashboard");

      cy.contains('a', 'Tienda').click();

      cy.wait(7000);
      cy.url().should("include", "/marketplace");

      cy.wait(2000);
      cy.get('[data-cy^="ver-detalles-produtos-"]').first().click();
      cy.wait(5000);

      //regex para buscar el precio.
      cy.contains(/^Gs\. \d{1,3}(\.\d{3})*$/).should("be.visible");

    })})