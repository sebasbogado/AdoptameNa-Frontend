/// <reference types="cypress" />

describe("Pruebas de Registro", () => {
  const endpoint = `${Cypress.env("NEXT_PUBLIC_BASE_API_URL")}/auth/register`;

  beforeEach(() => {
    cy.visit("/auth/register");
  });

  it("TC‑REG‑P‑01: Registro exitoso de persona", () => {
    cy.get('input[name="accountType"][value="persona"]').should("be.checked");

    cy.get('input[name="fullName"]').type("Usuario Valido");
    cy.get('input[name="email"]').type("gobaga8194@eligou.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    const uniqueEmail = `usuario.valido${Date.now()}@example.com`;
    cy.intercept("POST", endpoint, {
      statusCode: 200,
      body: {
        message:
          "✅ Registro exitoso. Revisa tu correo para verificar tu cuenta.",
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
    cy.get('input[name="email"]').type("usuario.valido123@example.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    cy.get("button[type='submit']").click();

    cy.contains("Nombre inválido").should("be.visible");
  });


  it("TC‑REG‑P‑05: Registro con email ya existente muestra error", () => {
    cy.get('input[name="fullName"]').type("Usuario Existente");
    cy.get('input[name="email"]').type("duplicado@example.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    cy.intercept("POST", "/api/auth/register", {
      statusCode: 409,
      body: { message: "❌ El correo ya está registrado. Intenta con otro." },
    }).as("registerRequest");
    
    cy.get("button[type='submit']").click(); // Envía el formulario
    
    cy.wait("@registerRequest"); // Ahora debería detectar la petición
    
    cy.url().should("include", "/auth/register");
  });

  it("TC‑REG‑P‑06: Registro con contraseña inválida muestra error", () => {
    cy.get('input[name="fullName"]').type("Usuario Valido");
    cy.get('input[name="email"]').type("usuario@example.com");
    cy.get('input[name="password"]').type("123");
    cy.get('input[name="confirmPassword"]').type("123");

    cy.get("button[type='submit']").click();
    cy.contains("La contraseña debe tener al menos 8 caracteres").should(
      "be.visible"
    );

    cy.get('input[name="password"]').clear().type("Password123");
    cy.get('input[name="confirmPassword"]').clear().type("Password124");

    cy.get("button[type='submit']").click();
    cy.contains("Las contraseñas no coinciden").should("be.visible");
  });

  
});
