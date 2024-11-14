import {FRONTEND_URL} from "../../../src/utils/constants";


export function loginViaAuth0Ui(username: string, password: string) {
  // App landing page redirects to Auth0.
    cy.visit(FRONTEND_URL)

    cy.intercept("POST", "https://" + Cypress.env("VITE_AUTH0_DOMAIN") + "/oauth/token").as("login")

    // Login on Auth0.
    cy.origin(Cypress.env("VITE_AUTH0_DOMAIN"),
        {args: {username, password}},
        ({username, password}) => {
            cy.get('input#username').type(username)
            cy.get('input#password').type(password, {log: false})
            cy.contains('button[value=default]', 'Continue').click()
        }
    )

    cy.wait('@login').then(({response}) => {
        const {access_token} = response.body
        cy.window().then((win) => {
            win.localStorage.setItem('authAccessToken', access_token)
        });
    });

    // Ensure Auth0 has redirected us back to the RWA.
    cy.url().should('equal', FRONTEND_URL + "/")
}




