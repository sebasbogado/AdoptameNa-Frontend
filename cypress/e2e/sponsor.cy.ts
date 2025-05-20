describe("Admin Panel - Activación de auspiciantes - TC-ADMIN-01", () => {
    it("Debería iniciar sesión y filtrar por estado Aprobado", () => {
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
      cy.contains('button', 'Auspiciantes').click();
      cy.wait(2000);
      cy.url().should("include", "/administration/sponsors");
      cy.get('select').select('Aprobado');
    });
  });
  