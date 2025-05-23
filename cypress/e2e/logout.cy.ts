describe("Logout Functionality - TC-REG-O-07", () => {
  it("should log out correctly and redirect when accessing protected routes", () => {
    // 1. Login con credenciales válidas
    cy.visit("/auth/login");
    cy.get('input[name="email"]').type("rodrigo.maidana2019@fiuni.edu.py", { delay: 100 });
    cy.get('input[name="password"]').type("Rodrigo29", { delay: 100 });
    cy.get('button[type="submit"]').click();

    // 2. Verificar login exitoso (redireccionado al dashboard)
    cy.wait(10000);
    cy.url().should("include", "/dashboard");

    // 3. Verificar que los elementos de usuario autenticado son visibles
    cy.get("#avatar").should("be.visible");

    // 4. Clic en el avatar para abrir el menú desplegable
    cy.get("#avatar").click();

    // 5. Clic en el botón de cerrar sesión
    cy.contains("Cerrar sesión").click();

    // 6. Verificar que se cerró la sesión y redireccionó al login
    cy.url().should("include", "/auth/login");

    // 8. Intentar acceder a una ruta protegida
    cy.visit("/profile");

    // 9. Verificar redirección a la página de login
    cy.wait(10000);
    cy.url().should("include", "/auth/login");
  });
});
