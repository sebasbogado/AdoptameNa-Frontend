describe("User Profile Functionality - TC-PROFILE-01", () => {
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
  
    it("Probar perfil del admin que redirija correctamente", () => {
      cy.wait(3500)
      cy.get("#avatar").click();
      cy.wait(3500)
      cy.contains("Administración").click();
      cy.wait(3500)
      cy.url().should("include", "/administration");
        
    });
    it("Verificar Favoritos", () => {
      cy.wait(3500)
      cy.get("#avatar").click();
      cy.wait(3500)
      cy.contains("Mis favoritos").click();
      cy.wait(3500)
      cy.url().should("include", "/favorites");
      
      
  });
  
   
  });
  