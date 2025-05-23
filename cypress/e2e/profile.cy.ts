describe("User Profile Functionality - TC-PROFILE-01", () => {
  it("should display user profile data correctly when authenticated", () => {
    // 1. Login con credenciales válidas
    cy.visit("/auth/login");
    cy.get('input[name="email"]').type("rodrigo.maidana2019@fiuni.edu.py", { delay: 100 });
    cy.get('input[name="password"]').type("Rodrigo29", { delay: 100 });
    cy.get('button[type="submit"]').click();

    cy.wait(7000);
    cy.url().should("include", "/dashboard");

    cy.get("#avatar").click();
    //cy.contains("rodrigo.maidana2019@fiuni.edu.py").should("be.visible");
    cy.contains('div[role="menuitem"]', 'Mi perfil').click();

    cy.url().should("include", "/profile");

    cy.get('input[type="text"]').should("have.value", "Rodrigo Maidana");

    cy.contains("h1", "Mis Mascotas").should("be.visible");

    cy.get("#edit-button").should("be.visible");
  });
});
