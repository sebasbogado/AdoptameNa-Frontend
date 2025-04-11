describe("Navbar Functionality", () => {
    beforeEach(() => {
        cy.visit("/dashboard"); // Asegurarse de que empieza desde la página principal
    });

    it("Navegar correctamente entre los links del navbar", () => {
        // 1. Login con credenciales válidas
        cy.visit("/auth/login");
        cy.get('input[type="email"]').type("cymtop@mailto.plus");
        cy.get('input[type="password"]').type("Holagato12");
        cy.get('button[type="submit"]').click();

        // 2. Verificar login exitoso (redireccionado al dashboard)
        cy.wait(5000);
        cy.url().should("include", "/dashboard");
        // 1. Click en el enlace 'Inicio' y verificar la URLç
        cy.wait(3500);
        cy.get("nav").contains("Inicio").click();
        cy.url().should("include", "/dashboard");
        cy.wait(3500);
        // 2. Click en 'Voluntariado' y verificar la URL
        cy.get("nav").contains("Voluntariado").click();
        cy.url().should("include", "/volunteering");
        cy.wait(3500);
        // 3. Click en 'Adopcion' y verificar la URL
        cy.get("nav").contains("Adopción").click();
        cy.url().should("include", "/adoption");
        cy.wait(3500);
        // 4. Click en 'Extraviados' y verificar la URL
        cy.get("nav").contains("Extraviados").click();
        cy.url().should("include", "/missing");
        cy.wait(3500);
        // 5. Click en 'Blog' y verificar la URL
        cy.get("nav").contains("Blog").click();
        cy.url().should("include", "/blog");
        cy.wait(3500);
        // 6. Click en 'Tienda' y verificar la URL
        cy.get("nav").contains("Tienda").click();
        cy.url().should("include", "/marketplace");

        cy.get("#avatar").click();
        cy.contains("cymtop@mailto.plus").should("be.visible");
        cy.contains("a", "Jose Ivan").click();
        cy.url().should("include", "/profile");

    });

});