describe("Admin Panel - Activación de auspiciantes - TC-ADMIN-01", () => {
    it("Debería iniciar sesión y activar un auspiciante", () => {
      // 1. Login con credenciales válidas de admin
      cy.visit("/auth/login");
      cy.get('input[name="email"]').type("rodrigo.maidana2019@fiuni.edu.py", { delay: 100 });
      cy.get('input[name="password"]').type("Contraseña123", { delay: 100 });
      cy.get('button[type="submit"]').click();
  
      cy.wait(7000);
      cy.url().should("include", "/dashboard");
  
      cy.get("#avatar").click();
      cy.contains('div[role="menuitem"]', 'Administración').click();
      cy.wait(2000);
      cy.url().should("include", "/administration");
      
      cy.wait(2000);
      cy.contains('button', 'Banners').click();
      cy.url().should("include", "/administration/settings/banner");
      cy.contains('button', 'Desactivar').first().click();

      cy.wait(2000);
      cy.contains('button', 'Activar').first().click();
      //Hasta aquí está bien
    });
  });
  