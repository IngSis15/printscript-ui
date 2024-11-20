import {BACKEND_URL, FRONTEND_URL} from "../../src/utils/constants";

describe('Add snippet tests', () => {
  beforeEach(() => {
    cy.loginToAuth0(
      Cypress.env("AUTH0_USERNAME"),
      Cypress.env("AUTH0_PASSWORD")
    )
  })
  it('Can add snippets manually', () => {
    cy.visit(FRONTEND_URL)

     cy.intercept('GET', BACKEND_URL+'/snippet/v1/snippet/user?page=0&size=10').as('getSnippets');

    cy.intercept('POST', BACKEND_URL+"/snippet/v1/snippet", (req) => {
      req.reply((res) => {
        expect(res.body).to.include.keys("id","name","content","language")
        expect(res.statusCode).to.eq(201);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('#name').type('Some snippet name');
    cy.get('#demo-simple-select').click()
    cy.get('[data-testid="menu-option-printscript"]').click()

    cy.get('[data-testid="add-snippet-code-editor"]').click();
    cy.get('[data-testid="add-snippet-code-editor"]').type(`const snippet: string = "some snippet";\n println(snippet);`);
    cy.get('[data-testid="SaveIcon"]').click();

    cy.wait('@getSnippets')
    cy.wait('@postRequest').its('response.statusCode').should('eq', 201);
  })

  it('Can add snippets via file', () => {
    cy.visit(FRONTEND_URL)

    cy.intercept('GET', BACKEND_URL+'/snippet/v1/snippet/user?page=0&size=10').as('getSnippets');

    cy.intercept('POST', BACKEND_URL+"/snippet/v1/snippet", (req) => {
      req.reply((res) => {
        expect(res.body).to.include.keys("id","name","content","language")
        expect(res.statusCode).to.eq(201);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-testid="upload-file-input"').selectFile("cypress/fixtures/example_ps.ps", {force: true})

    cy.get('[data-testid="SaveIcon"]').click();

    cy.wait('@getSnippets')
    cy.wait('@postRequest').its('response.statusCode').should('eq', 201);
  })
})
