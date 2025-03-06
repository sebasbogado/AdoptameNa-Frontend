/// <reference types="cypress" />

describe("Pruebas de Login - TypeScript", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  it("TC-LGN-01: El usuario inicia sesión exitosamente y es redirigido al dashboard", () => {
    cy.log("Interceptando la solicitud de inicio de sesión...");
    cy.intercept(
      "POST",
      `${Cypress.env("NEXT_PUBLIC_BASE_API_URL")}/auth/login`,
      {
        statusCode: 200,
        body: {
          token: "fake-token",
          user: {
            id: 1,
            name: "Test User",
            email: "test@example.com",
          },
        },
      }
    ).as("loginRequest");

    cy.get('input[name="email"]').type("cymtop@mailto.plus", { delay: 100 });
    cy.get('input[name="password"]').type("Holagato12", { delay: 100 });
    cy.log(
      "Formulario completado con email: cymtop@mailto.plus y contraseña: Holagato12"
    );

    cy.log("Haciendo clic en el botón de inicio de sesión...");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");
    cy.log("Respuesta de inicio de sesión recibida.");

    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");
      cy.log(`Token almacenado en localStorage: ${token}`);
      expect(token).to.eq("fake-token");
    });

    cy.wait(5000);
    cy.log("Verificando que la URL ha cambiado a /dashboard...");
    cy.url().should("include", "/dashboard");
  });

  it("TC-LGN-02: El usuario ingresa una contraseña incorrecta y se muestra error", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("NEXT_PUBLIC_BASE_API_URL")}/auth/login`,
      {
        statusCode: 403,
        body: { message: "Contraseña incorrecta" },
      }
    ).as("loginRequest");

    cy.get('input[name="email"]').type("cymtop@mailto.plus", { delay: 100 });
    cy.get('input[name="password"]').type("wrongPassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");

    cy.contains("❌ Correo o contraseña incorrectos.").should("be.visible");
    cy.url().should("include", "/login");
  });

  it("TC-LGN-03: El usuario introduce un correo que no existe y se muestra error", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("NEXT_PUBLIC_BASE_API_URL")}/auth/login`,
      {
        statusCode: 403,
        body: { message: "Usuario no existe" },
      }
    ).as("loginRequest");

    cy.get('input[name="email"]').type("nonexistent@example.com");
    cy.get('input[name="password"]').type("anyPassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");

    cy.contains("❌ Correo o contraseña incorrectos.").should("be.visible");
    cy.url().should("include", "/login");
  });

  it("TC-LGN-04: No completar los campos de correo y/o contraseña no realiza envío", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("NEXT_PUBLIC_BASE_API_URL")}/auth/login`
    ).as("loginRequest");

    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').clear();

    cy.get('button[type="submit"]').click();

    cy.wait(1000).then(() => {
      cy.get("@loginRequest.all").should("have.length", 0);
    });
  });

  it("TC-LGN-05: Login: Cuenta no verificada muestra mensaje especial", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("NEXT_PUBLIC_BASE_API_URL")}/auth/login`,
      {
        statusCode: 403,
        body: { message: "la cuenta no está verificada" },
      }
    ).as("loginRequest");

    cy.get('input[name="email"]').type("cymtopa@mailto.plus");
    cy.get('input[name="password"]').type("Holagaot12");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");

    cy.contains(
      "⚠️ Tu cuenta aún no está verificada. Revisa tu correo para activarla."
    ).should("be.visible");
    cy.url().should("include", "/login");
  });
});
