import {BACKEND_URL, FRONTEND_URL} from "../../src/utils/constants";

describe('Home', () => {
  beforeEach(() => {
    cy.loginToAuth0(
      Cypress.env("AUTH0_USERNAME"),
      Cypress.env("AUTH0_PASSWORD")
    )
  })
  it('Renders home', () => {
    cy.visit(FRONTEND_URL)
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiTypography-h6').should('have.text', 'Printscript');
    cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').should('be.visible');
    cy.get('.css-9jay18 > .MuiButton-root').should('be.visible');
    cy.get('.css-jie5ja').click();
    /* ==== End Cypress Studio ==== */
  })

  // You need to have at least 1 snippet in your DB for this test to pass
  it('Renders the first snippets', () => {
    cy.visit(FRONTEND_URL)
    const first10Snippets = cy.get('[data-testid="snippet-row"]')

    first10Snippets.should('have.length.greaterThan', 0)

    first10Snippets.should('have.length.lessThan', 11)
  })

  it('Can create snippet find snippets by name', () => {
    cy.visit(FRONTEND_URL)
    const snippetData = {
      name: "Test name",
      description: "",
      content: "println(1);",
      language: "printscript",
      extension: ".ps"
    }

    cy.intercept('GET', BACKEND_URL+"snippet/v1/snippet*", (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as('getSnippets');

    cy.request({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authAccessToken')}`
      },
      url: BACKEND_URL+"/snippet/v1/snippet",
      body: snippetData,
      failOnStatusCode: false // Optional: set to true if you want the test to fail on non-2xx status codes
    }).then((response) => {
      expect(response.status).to.eq(201);

      expect(response.body.name).to.eq(snippetData.name)
      expect(response.body.content).to.eq(snippetData.content)
      expect(response.body.language).to.eq(snippetData.language)
      expect(response.body).to.haveOwnProperty("id")

      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').clear();
      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').type(snippetData.name + "{enter}");

      cy.contains(snippetData.name).should('exist');
    })
  })
})
