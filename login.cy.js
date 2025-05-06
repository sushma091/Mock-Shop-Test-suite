describe("Login Page Tests", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/public/index.html");
  });

  // Test Case #1
  it("should display the Login title, Username and Password input fields, and Login button", () => {
    cy.contains("h1", "Login").should("be.visible");
    cy.get('input[name="username"]').should("be.visible");
    cy.contains("Username").should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.contains("Password").should("be.visible");
    cy.contains("button", "Login").should("be.visible");
  });

  // Test Case #2
  it("should login with valid credentials and logout successfully", () => {
    cy.login();
  });

  // Test Case #3
  it("should not login with invalid credentials", () => {
    cy.get('input[name="username"]').type("user2");
    cy.get('input[name="password"]').type("user2");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "http://127.0.0.1:5500/public/index.html");
    cy.contains("Invalid username or password").should("be.visible");
  });
  // Test Case #4
  it("should not login when user name is case Sensitive", () => {
    cy.get('input[name="username"]').type("USER1");
    cy.get('input[name="password"]').type("user1");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "http://127.0.0.1:5500/public/index.html");
    cy.contains("Invalid username or password").should("be.visible");
  });
  // Test Case #5
  it("should not login with valid username and invalid password credentials", () => {
    cy.get('input[name="username"]').type("user1");
    cy.get('input[name="password"]').type("user2");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "http://127.0.0.1:5500/public/index.html");
    cy.contains("Invalid username or password").should("be.visible");
  });
  // Test Case #6
  it("should not login with invalid username and valid password credentials", () => {
    cy.get('input[name="username"]').type("user23");
    cy.get('input[name="password"]').type("user1");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "http://127.0.0.1:5500/public/index.html");
  });
  // Test Case #7
  it("should navigate to login screen when user hits back on browser", () => {
    cy.get('input[name="username"]').type("user1");
    cy.get('input[name="password"]').type("user1");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "http://127.0.0.1:5500/public/shop.html");
    cy.go("back");
    cy.url().should("include", "http://127.0.0.1:5500/public/index.html");
  });
});
