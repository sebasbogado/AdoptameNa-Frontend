/// <reference types="cypress" />

describe("Pruebas de Registro - Organización", () => {
  const endpoint = `${Cypress.env("NEXT_PUBLIC_BASE_API_URL")}/auth/register`;

  beforeEach(() => {
    cy.visit("/auth/register");
    cy.get('input[name="accountType"][value="organizacion"]').click();
  });

  it("TC‑REG‑O‑01: Registro exitoso de organización", () => {
    cy.get('input[name="organizationName"]').type("Organización Ejemplo");
    cy.get('input[name="fullName"]').type("Responsable Ejemplo");
    cy.get('input[name="email"]').type("org.ejemplo@example.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    const uniqueEmail = `org.ejemplo${Date.now()}@example.com`;

    cy.intercept("POST", endpoint, {
      statusCode: 200,
      body: {
        message:
          "Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.",
      },
    }).as("registerRequest");

    cy.get("button[type='submit']").click();

    cy.wait("@registerRequest");

    cy.contains(
      "✅ Registro exitoso. Revisa tu correo para verificar tu cuenta."
    ).should("be.visible");
    cy.wait(3500);
    cy.url().should("include", "/auth/login");
  });

  it("TC‑REG‑O‑02: Registro omitiendo 'nombre del responsable' muestra error", () => {
    cy.get('input[name="organizationName"]').type("Organización Ejemplo");
    cy.get('input[name="email"]').type("org.ejemplo@example.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    cy.get("button[type='submit']").click();
    cy.contains("Nombre inválido (Máx. 50 caracteres, min. 5)").should(
      "be.visible"
    );
  });

  it("TC‑REG‑O‑03: Registro sin 'nombre de la organización' muestra error", () => {
    cy.get('input[name="fullName"]').type("Responsable Ejemplo");
    cy.get('input[name="email"]').type("org.ejemplo@example.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    cy.get("button[type='submit']").click();
    cy.contains(
      "Nombre de la organización inválido (Máx. 50 caracteres, min. 5)"
    ).should("be.visible");
  });

  it("TC‑REG‑O‑04: Registro con email inválido muestra error", () => {
    cy.get('input[name="organizationName"]').type("Organización Ejemplo");
    cy.get('input[name="fullName"]').type("Responsable Ejemplo");
    cy.get('input[name="email"]').type("org.ejemploexample.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    cy.get("button[type='submit']").click();
    cy.contains("Correo inválido").should("be.visible");
  });

  it("TC‑REG‑O‑05: Registro con email duplicado muestra error", () => {
    cy.get('input[name="organizationName"]').type("Organización Ejemplo");
    cy.get('input[name="fullName"]').type("Responsable Ejemplo");
    cy.get('input[name="email"]').type("duplicado_org@example.com");
    cy.get('input[name="password"]').type("Password123");
    cy.get('input[name="confirmPassword"]').type("Password123");

    cy.intercept("POST", endpoint, {
      statusCode: 409,
      body: { message: "❌ El correo ya está registrado. Intenta con otro." },
    }).as("registerRequest");

    cy.get("button[type='submit']").click();

    cy.wait("@registerRequest");
    cy.contains("❌ El correo ya está registrado. Intenta con otro.").should(
      "be.visible"
    );
    cy.url().should("include", "/auth/register");
  });

  it("TC‑REG‑O‑06: Registro con contraseña inválida muestra error", () => {
    cy.get('input[name="organizationName"]').type("Organización Ejemplo");
    cy.get('input[name="fullName"]').type("Responsable Ejemplo");
    cy.get('input[name="email"]').type("org.ejemplo@example.com");
    cy.get('input[name="password"]').type("123");
    cy.get('input[name="confirmPassword"]').type("123");

    cy.get("button[type='submit']").click();
    cy.contains("La contraseña debe tener al menos 6 caracteres").should(
      "be.visible"
    );

    cy.get('input[name="password"]').clear().type("Password123");
    cy.get('input[name="confirmPassword"]').clear().type("Password124");

    cy.get("button[type='submit']").click();
    cy.contains("Las contraseñas no coinciden").should("be.visible");
  });
});
