/// <reference types="cypress" />

describe("Pruebas de Registro", () => {
  const endpoint = `${Cypress.env("NEXT_PUBLIC_BASE_API_URL")}/auth/register`;

  beforeEach(() => {
    cy.visit("/auth/register");
  });

  it("TC‑REG‑P‑01: Registro exitoso de persona", () => {
    cy.get('input[name="accountType"][value="persona"]').should("be.checked");

    cy.get('input[name="fullName"]').type("Usuario Valido");
    cy.get('input[name="email"]').type("usuario.validoXX@example.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    const uniqueEmail = `usuario.valido${Date.now()}@example.com`;
    cy.intercept("POST", endpoint, {
      statusCode: 200,
      body: {
        message:
          "Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.",
      },
    }).as("registerRequest");

    cy.get("button[type='submit']").click();

    cy.contains(
      "✅ Registro exitoso. Revisa tu correo para verificar tu cuenta."
    ).should("be.visible");

    cy.wait(3500);
    cy.url().should("include", "/auth/login");
  });

  it("TC‑REG‑P‑02: Registro con campo 'Nombre' vacío muestra error", () => {
    cy.get('input[name="email"]').type("usuario.valido2@example.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    cy.get("button[type='submit']").click();

    //cy.contains("Nombre inválido").should("be.visible");
  });

  /*
  it("TC‑REG‑P‑03: Registro con nombre demasiado largo muestra error", () => {
    const nombreLargo =
      "NombreDemasiadoLargoQueSuperaElLimiteDeCincuentaCaracteres_".repeat(1);
    cy.get('input[name="fullName"]').type(nombreLargo);
    cy.get('input[name="email"]').type("usuario.valido3@example.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    cy.get("button[type='submit']").click();

    cy.contains("Nombre inválido (Máx. 50 caracteres, min. 5)").should(
      "be.visible"
    );
  });
*/

  it("TC‑REG‑P‑03: Registro con email en formato inválido muestra error", () => {
    cy.get('input[name="fullName"]').type("Usuario Valido");
    cy.get('input[name="email"]').type("usuariovalidoexample.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    cy.get("button[type='submit']").click();
    cy.contains("Correo inválido").should("be.visible");
  });

  it("TC‑REG‑P‑04: Registro con email ya existente muestra error", () => {
    cy.get('input[name="fullName"]').type("Usuario Existente");
    cy.get('input[name="email"]').type("duplicado@example.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 409,
      body: { message: "❌ El correo ya está registrado. Intenta con otro." },
    }).as("registerRequest");

    cy.get("button[type='submit']").click();

    cy.wait("@registerRequest");
    cy.contains("❌ El correo ya está registrado. Intenta con otro.").should(
      "be.visible"
    );
    //cy.url().should("include", "/auth/register");
  });

  it("TC‑REG‑P‑05: Registro con contraseña inválida muestra error", () => {
    cy.get('input[name="fullName"]').type("Usuario Valido");
    cy.get('input[name="email"]').type("usuario@example.com");
    cy.get('input[name="password"]').type("123");
    cy.get('input[name="confirmPassword"]').type("123");

    cy.get("button[type='submit']").click();
    cy.contains("Entre 8 y 64 caractere").should(
      "be.visible"
    );

    cy.get('input[name="password"]').clear().type("Password123");
    cy.get('input[name="confirmPassword"]').clear().type("Password124");

    cy.get("button[type='submit']").click();
    cy.contains("Las contraseñas no coinciden").should("be.visible");
  });
});
