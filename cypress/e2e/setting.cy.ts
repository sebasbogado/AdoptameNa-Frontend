describe("Admin Panel - Visualizar el apartado de configuraciones - TC-ADMIN-01", () => {
    it("Debería iniciar sesión y poder acceder al apartado de configuraciones.", () => {
      // 1. Login con credenciales válidas de admin
      cy.visit("/auth/login");
      cy.get('input[name="email"]').type("rodrigo.maidana2019@fiuni.edu.py", { delay: 100 });
      cy.get('input[name="password"]').type("Rodrigo29", { delay: 100 });
      cy.get('button[type="submit"]').click();
  
      cy.wait(10000);
      cy.url().should("include", "/dashboard");
  
      cy.get("#avatar").click();
      cy.contains('div[role="menuitem"]', 'Administración').click();
      cy.wait(2000);
      cy.url().should("include", "/administration");
      
      cy.wait(2000);
      cy.get("#configuration-id").click();
      cy.get("#settings-id").click();
      
      cy.wait(5000);
      cy.url().should("include", "/administration/settings");

    });
  });
  