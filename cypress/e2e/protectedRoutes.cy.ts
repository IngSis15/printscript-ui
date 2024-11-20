import {FRONTEND_URL} from "../../src/utils/constants";

describe('Protected routes test', () => {
  it('should redirect to login when accessing a protected route unauthenticated', () => {
    // Visit the protected route
    cy.visit(FRONTEND_URL)

    cy.wait(1000)

    // Check if the URL is redirected to the login page
    cy.origin(Cypress.env('VITE_AUTH0_DOMAIN'), () => {
      cy.url().should('include', '/login');
    });
  });

  it('should display login content', () => {
    // Visit the login page
    cy.visit(FRONTEND_URL)

    cy.origin(Cypress.env('VITE_AUTH0_DOMAIN'), () => {
      cy.contains('Log in').should('exist');
      cy.contains('Password').should('exist');
    });
  });

  it('should not redirect to login when the user is already authenticated', () => {
     cy.loginToAuth0(
      Cypress.env("AUTH0_USERNAME"),
      Cypress.env("AUTH0_PASSWORD")
    )

    cy.visit(FRONTEND_URL);

    cy.wait(1000)

    // Check if the URL is redirected to the login page
    cy.url().should('not.include', '/login');
  });

})
