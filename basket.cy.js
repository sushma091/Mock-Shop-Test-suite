import { products } from "../fixtures/products";
describe("Basket Page Tests", () => {
  beforeEach(() => {
    cy.login();
    cy.get(".product-card").eq(2).contains("Add to Basket").click();
    cy.get(".product-card").eq(3).contains("Add to Basket").click();
    cy.contains("View Basket").click();
  });
  // Test Case #1
  it("should display products in basket", () => {
    cy.get("#basketList").should("have.length.at.least", 1);
  });

  // Test Case #2
  it("should verify all product details and quantities in the basket", () => {
    cy.window().then((win) => {
      const basket = JSON.parse(win.localStorage.getItem("basket") || "[]");
      expect(basket.length).to.be.greaterThan(0);

      basket.forEach((product) => {
        cy.get("#basketList .product-card")
          .contains(product.description)
          .parents(".product-card")
          .within(() => {
            cy.get("p").should("contain.text", `Code: ${product.productCode}`);
            cy.get("p").should(
              "contain.text",
              `Price: $${parseFloat(product.price).toFixed(2)}`
            );
            cy.get("p").should("contain.text", `UOM: ${product.uom}`);
            cy.get("p").should("contain.text", `Qty in Basket: ${product.qty}`);
            cy.get("img").should("have.attr", "src", product.productImage);
          });
      });
    });
  });

  // Test Case #3
  it("should calculate the correct total price", () => {
    cy.verifyBasketTotal();
  });

  // Test Case #4
  it("should reflect correct quantity and total when the same product is added multiple times", () => {
    const repeatCount = 3;
    const repeatedProduct = products[2];
    const productName = repeatedProduct.description;
    cy.contains("Clear Basket").click();
    cy.contains("Back to Shop").click();

    for (let i = 0; i < repeatCount; i++) {
      cy.get(".product-card")
        .contains(productName)
        .parents(".product-card")
        .contains("Add to Basket")
        .click();
    }

    cy.contains("View Basket").click();

    cy.get("#basketList .product-card")
      .contains(productName)
      .parents(".product-card")
      .within(() => {
        cy.get("p").should("contain.text", `Qty in Basket: ${repeatCount}`);
      });
    cy.verifyBasketTotal();
  });

  // Test Case #5
  it("should add all 6 products to the basket and verify the displayed products", () => {
    cy.contains("Clear Basket").click();
    cy.contains("Back to Shop").click();
    cy.get(".product-card")
      .should("have.length", 6)
      .each(($el) => {
        cy.wrap($el).contains("Add to Basket").click();
      });

    cy.contains("View Basket").click();
    cy.get("#basketList .product-card").should("have.length", 6);

    cy.window().then((win) => {
      const basket = JSON.parse(win.localStorage.getItem("basket") || "[]");
      expect(basket.length).to.equal(6);

      basket.forEach((product) => {
        cy.get("#basketList .product-card")
          .contains(product.description)
          .parents(".product-card")
          .within(() => {
            cy.get("p").should("contain.text", `Code: ${product.productCode}`);
            cy.get("p").should(
              "contain.text",
              `Price: $${parseFloat(product.price).toFixed(2)}`
            );
            cy.get("p").should("contain.text", `UOM: ${product.uom}`);
            cy.get("p").should("contain.text", `Qty in Basket: ${product.qty}`);
            cy.get("img").should("have.attr", "src", product.productImage);
          });
      });
    });
  });

  // Test Case #6
  it("should clear basket and show basket cleared message", () => {
    cy.window().then((win) => cy.stub(win, "alert").as("alert"));
    cy.contains("Clear Basket").click();
    cy.get("@alert").should("have.been.calledWithMatch", /Basket cleared/i);
    cy.contains("Your basket is empty").should("be.visible");
    cy.get("#basketTotal").should("contain", "$0.00");
  });

  // Test Case #7
  it("should display the page title,Empty message,Total,Back to Shop,clear Basket,Logout buttons", () => {
    cy.contains("Clear Basket").click();
    cy.contains("h1", "Basket").should("be.visible");
    cy.contains("Your basket is empty").should("be.visible");
    cy.contains("button", "Back to Shop").should("be.visible");
    cy.contains("button", "Clear Basket").should("be.visible");
    cy.contains("button", "Logout").should("be.visible");
    cy.get("#basketTotal").should("contain", "$0.00");
  });

  // Test Case #8
  it("should go back to shop page", () => {
    cy.contains("Back to Shop").click();
    cy.url().should("include", "http://127.0.0.1:5500/public/shop.html");
  });

  // Test Case #9
  it("should logout and clear basket", () => {
    cy.logoutAndVerifyClearedBasket();
  });
});
