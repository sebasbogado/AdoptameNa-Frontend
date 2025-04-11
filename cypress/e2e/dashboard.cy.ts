describe("User Profile Functionality - TC-PROFILE-01", () => {
    beforeEach(() => {
      cy.session("userSession", () => {
        cy.visit("/auth/login");
        cy.get('input[type="email"]').type("cymtop@mailto.plus");
        cy.get('input[type="password"]').type("Holagato12");
        cy.get('button[type="submit"]').click();
        cy.url().should("include", "/dashboard");
      });
      cy.visit("/dashboard");
    });
  
    it("Probar cada link del dashboard", () => {
        // 1. Click en 'En Adopcion' y verificar la URL
        cy.wait(3500);
        cy.get('a[href="adoption"]').click();
        cy.url().should("include", "/adoption");    
        cy.wait(3500);   
        cy.visit("/dashboard");
        
        // 2. Click en 'Extraviados' y verificar la URL
        cy.wait(3500);
        cy.get('a[href="missing"]').click();
        cy.url().should("include", "/missing");
        cy.wait(3500);
        cy.visit("/dashboard");
        // 3. Click en 'Voluntariado' y verificar la URL
        cy.wait(3500);
        cy.get('a[href="volunteering"]').click();
        cy.url().should("include", "/volunteering");
        cy.wait(3500);
        cy.visit("/dashboard");
        // 4. Click en 'Blog' y verificar la URL
        cy.wait(3500);
        cy.get('a[href="blog"]').click();
        cy.url().should("include", "/blog");
        cy.wait(3500);
        cy.visit("/dashboard");
    });
    it("Probar cards del dashboard", () => {
      it("TC-REDIRECCION-CARD: Click en card redirige a la página correcta", () => {
        cy.visit("https://dev--adoptamena.netlify.app"); // Asegúrate de que la URL es la correcta
        cy.wait(3500);
        cy.get('a[href="/posts/2"]').click(); // Busca el enlace dentro de la card y haz clic
        cy.wait(3500);
        cy.url().should("eq", "https://dev--adoptamena.netlify.app/posts/2"); // Verifica la redirección
        cy.wait(3500);
        cy.visit("/dashboard");
      });
      
  });
  
   
  });
  