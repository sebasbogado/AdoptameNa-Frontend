describe("Admin Panel - Ver detalles de un reporte - TC-ADMIN-01", () => {
    it("Debería iniciar sesión, ir a mis reportes y ver el detalle del primer card, verificando que se muestre el detalle del mismo.", () => {

    // 1. Login con credenciales válidas de admin
      cy.visit("/auth/login");
      cy.get('input[name="email"]').type("rodrigo.maidana2019@fiuni.edu.py", { delay: 100 });
      cy.get('input[name="password"]').type("Rodrigo29", { delay: 100 });
      cy.get('button[type="submit"]').click();
  
      cy.wait(7000);
      cy.url().should("include", "/dashboard");

      cy.get("#avatar").should("be.visible").click();

      cy.contains("Mis reportes").click();

      cy.wait(4000);

      cy.url().should("include", "/profile/report");

      cy.get('a[href="/profile/report/pets"]').click();

      cy.wait(4000);

      cy.get('a[href="/profile/report/pets/16"] button').first().contains('Ver Reportes').click();
    
      cy.url().should('match', /\/profile\/report\/pets\/\d+$/);

    })})