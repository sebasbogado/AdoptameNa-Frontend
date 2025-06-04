describe("Contact to support", () => {
  it("Deberia iniciar sesion, hacer clich en el boton del footer para contactar al soporte porcorreo.", () => {
    // 1. Login con credenciales válidas
    cy.visit("/auth/login");
    cy.get('input[name="email"]').type("rodrigo.maidana2019@fiuni.edu.py", { delay: 100 });
    cy.get('input[name="password"]').type("Rodrigo29", { delay: 100 });
    cy.get('button[type="submit"]').click();

    cy.wait(7000);
    cy.url().should("include", "/dashboard");

    cy.wait(2000);
    cy.get('#contact-to-support-link')
      .should('be.visible')
      .and('have.attr', 'href')
      .and('include', 'mailto:adoptamena@gmail.com');

  })})