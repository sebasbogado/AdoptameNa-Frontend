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

  it("Debe mostrar los datos del perfil del usuario correctamente cuando se autentica", () => {
    cy.visit("/profile");
    cy.get("input").should("have.value", "Jose Ivan");
    cy.contains("h1", "Mis Mascotas").should("be.visible");
  });

  it("Debe editar y guardar los cambios cuando no hay cambios", () => {
    cy.wait(3500);
    cy.visit("/profile");
    cy.wait(3500);
    cy.get('[id="edit-button"]').click();
    cy.wait(3500);
    cy.get("button").contains("Guardar").click();
  });
  it("Debe editar y guardar correctamente los cambios", () => {
    cy.wait(4500);
    cy.visit("/profile");
    cy.wait(4500);
    cy.get('[id="edit-button"]').click();
    cy.wait(4500);
    cy.get("input").should("have.value", "Jose Ivan").clear().type("Teste{backspace} Automatizado{enter}");
     
  });
});
