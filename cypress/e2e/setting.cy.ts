describe("Admin Panel - Creación de un tipo de mascota - TC-ADMIN-01", () => {
    it("Debería iniciar sesión, crear un tipo de mascota y eliminarla", () => {
      // 1. Login con credenciales válidas de admin
      cy.visit("/auth/login");
      cy.get('input[name="email"]').type("rodrigo.maidana2019@fiuni.edu.py", { delay: 100 });
      cy.get('input[name="password"]').type("Contraseña123", { delay: 100 });
      cy.get('button[type="submit"]').click();
  
      cy.wait(10000);
      cy.url().should("include", "/dashboard");
  
      cy.get("#avatar").click();
      cy.contains('div[role="menuitem"]', 'Administración').click();
      cy.wait(2000);
      cy.url().should("include", "/administration");
      
      cy.wait(2000);
      cy.contains('button', 'Configuraciones').click();
      cy.wait(5000);
      cy.url().should("include", "/administration/settings");

      cy.wait(5000);
      cy.get('svg.lucide-plus').first().parent().click();
      cy.get('input[name="name"]').type('Loro');
      cy.contains('button', 'Guardar').click();
      

      cy.wait(7000);
      
      cy.contains('div', 'Loro').click();
      cy.wait(1000);
      cy.contains('button', 'Eliminar').click();
      cy.wait(1000);
      cy.get('button.bg-btn-danger.hover\\:bg-red-900').click();

      cy.wait(1000);

    });
  });
  