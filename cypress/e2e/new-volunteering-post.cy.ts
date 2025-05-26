describe("Crear un post. ", () => {
    it("Debería iniciar sesión, crear un post de tipo voluntariado.", () => {

    // 1. Login con credenciales válidas de admin
      cy.visit("/auth/login");
      cy.get('input[name="email"]').type("rodrigo.maidana2019@fiuni.edu.py", { delay: 100 });
      cy.get('input[name="password"]').type("Rodrigo29", { delay: 100 });
      cy.get('button[type="submit"]').click();
  
      cy.wait(7000);
      cy.url().should("include", "/dashboard");
    
      cy.get('button[aria-label="Crear publicación"]').click();
      cy.wait(2000);

      cy.get('#add-post').click();
      cy.wait(5000);

      cy.url().should("include", "/add-post");

      cy.get('select').select('Voluntariado');

      cy.contains('button', 'Seleccionar tags').click();

      const tagsASeleccionar = ['Perros', 'Adopciones', 'Cuidados'];

      tagsASeleccionar.forEach((tag) => {
        cy.contains('li', tag).click();
      });

      cy.get('input[name="title"]').type('Mi publicación de prueba', { force: true });

      cy.get('textarea[name="content"]').type('Esta es la descripción del post.', { force: true });

      cy.get('input[name="contactNumber"]').type('0981123456', { force: true });

      cy.get('.leaflet-container', { timeout: 10000 }).should('exist');

      // Hacer clic en coordenadas dentro del mapa
      cy.get('.leaflet-container').click(300, 350);

      // Verificar que se haya agregado un marcador
      cy.get('.leaflet-marker-icon').should('exist');

      //cy.contains('button', 'Crear publicación').click();


    })})