describe("User Profile Functionality - TC-PROFILE-01", () => {
  it("should display user profile data correctly when authenticated", () => {
    // 1. Login con credenciales válidas
    cy.visit("/auth/login");
    cy.get('input[type="email"]').type("cymtop@mailto.plus");
    cy.get('input[type="password"]').type("Holagato12");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");

    cy.get("#avatar").click();
    cy.contains("cymtop@mailto.plus").should("be.visible");
    cy.contains("a", "Jose Ivan").click();

    cy.url().should("include", "/profile");

    cy.get("h1").should("contain", "Jose Ivan");

    cy.contains("h1", "Mis Mascotas").should("be.visible");

    cy.contains("button", "Contactar").should("be.visible");
    cy.get("#edit-button").should("be.visible");
  });
});
