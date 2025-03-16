describe("User Profile Functionality - TC-PROFILE-01", () => {
    beforeEach(() => {
      cy.session("userSession", () => {
        cy.visit("/auth/login");
        cy.get('input[type="email"]').type("cymtop@mailto.plus");
        cy.get('input[type="password"]').type("Holagato12");
        cy.get('button[type="submit"]').click();
        cy.url().should("include", "/dashboard");
      });
    });
  
    it("Probar cada link del dashboard", () => {
        // 2. Click en 'En Adopcion' y verificar la URL
        cy.wait(3500);
        cy.contains("h1", "En Adopcion").click();
        cy.url().should("include", "/adoption");
        cy.visit("/dashboard");
        
        // 2. Click en 'Extraviados' y verificar la URL
        cy.wait(3500);
        cy.contains("h1", "Extraviados").click();
        cy.url().should("include", "/missing");
        cy.visit("/dashboard");
        // 3. Click en 'Voluntariado' y verificar la URL
        cy.wait(3500);
        cy.contains("h1", "Voluntariado").click();
        cy.url().should("include", "/volunteering");
        cy.visit("/dashboard");
        // 4. Click en 'Blog' y verificar la URL
        cy.wait(3500);
        cy.contains("h1", "Blog").click();
        cy.url().should("include", "/blog");
        cy.visit("/dashboard");
    });
  
   
  });
  