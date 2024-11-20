import {BACKEND_URL, FRONTEND_URL} from "../../src/utils/constants";

describe('Add snippet tests', () => {
  beforeEach(() => {
    cy.loginToAuth0(
      Cypress.env("AUTH0_USERNAME"),
      Cypress.env("AUTH0_PASSWORD")
    )
    cy.visit(FRONTEND_URL)
    cy.intercept('GET', BACKEND_URL + "/snippet/v1/snippet/*").as('getSnippets');

    // Wait for multiple responses
    cy.wait('@getSnippets').then((interception) => {
      // Check if the first response is a 401 (expected)
      if (interception.response.statusCode === 401) {
        cy.log('Received expected 401 response. Waiting for next request...');

        // Wait for the next 200 response
        cy.wait('@getSnippets').then((secondInterception) => {
          if (secondInterception.response.statusCode === 200) {
            cy.log('Received 200 response. Proceeding with click...');
            cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1)').click();
          } else {
            cy.log('Second response was not 200. Skipping click.');
          }
        });
      } else if (interception.response.statusCode === 200) {
        // If the first response is 200 (unexpected but valid), proceed directly
        cy.log('Received 200 response. Proceeding with click...');
        cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1)').click();
      } else {
        cy.log(`Unexpected status code: ${interception.response.statusCode}`);
      }
    });
  })

  it('Can share a snippet ', () => {
    cy.get('[aria-label="Share"]').click();
    cy.get('#\\:r9\\:').click();
    cy.get('#\\:r9\\:-option-0').click();
    cy.get('.css-1yuhvjn > .MuiBox-root > .MuiButton-contained').click();
    cy.wait(2000)
  })

  it('Can format snippets', function () {
    cy.get('[data-testid="ReadMoreIcon"] > path').click();
  });

  it('Can save snippets', function () {
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').click();
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').type("Some new line");
    cy.get('[data-testid="SaveIcon"] > path').click();
  });

  it('Can delete snippets', function () {
    cy.get('[data-testid="DeleteIcon"] > path').click();
  });
})
