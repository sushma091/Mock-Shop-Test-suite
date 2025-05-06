import { products } from "../fixtures/products";
describe("Shop Page Tests", () => {
  const product = products[0];
  const lastProduct = products[products.length - 1];
  const invalidSearchValues = ["$5.99", "kg", "10", "UNIT", "Liter", "Butter"];
  beforeEach(() => {
    cy.login();
  });

  //Test case #1
  it("should display the shop page title, search box, search, view basket and logout buttons", () => {
    cy.contains("h1", "Shop").should("be.visible");
    cy.get("#searchInput").should("be.visible").and("have.attr", "placeholder");
    cy.contains("button", "Search").should("be.visible");
    cy.contains("button", "View Basket").should("be.visible");
    cy.contains("button", "Logout").should("be.visible");
  });
  //Test case #2
  it("should display all the 6 products", () => {
    cy.get(".product-card").should("have.length", 6);
  });
  // Test case #3

  it("should display each product with product code,UOM,Product image,price, Quantity, description and Add to basket button ", () => {
    cy.get(".product-card").each(($card, index) => {
      const product = products[index];
      cy.wrap($card).find("h3").should("contain.text", product.description);
      cy.wrap($card).contains(`Code: ${product.productCode}`).should("exist");
      cy.wrap($card)
        .contains(`Price: $${product.price.toFixed(2)}`)
        .should("exist");
      cy.wrap($card).contains(`Qty: ${product.qty}`).should("exist");
      cy.wrap($card).find("button").contains("Add to Basket").should("exist");
      cy.wrap($card)
        .find("img")
        .should("have.attr", "src", product.productImage)
        .and("be.visible");
    });
  });

  //Test case #4

  it(`should filter product using search by code and clears the search input values and displays all products when user hits serach button: ${product.productCode}`, () => {
    cy.searchFor(product.productCode);
    cy.get("#productList .product-card")
      .should("have.length.at.least", 1)
      .contains(product.productCode);
    cy.get("#searchInput").clear();
    cy.contains("button", "Search").click();
    cy.get(".product-card").should("have.length", 6);
  });

  //Test Case #5
  it(`should filter product using search by description and verify that product details are matched: ${product.description}`, () => {
    cy.searchFor(product.description);
    cy.get("#productList .product-card")
      .should("have.length.at.least", 1)
      .within(() => {
        cy.get("h3").should("contain.text", product.description);
        cy.contains(`Code: ${product.productCode}`).should("exist");
        cy.contains(`Price: $${product.price.toFixed(2)}`).should("exist");
        cy.contains(`Qty: ${product.qty}`).should("exist");

        cy.get("img")
          .should("have.attr", "src", product.productImage)
          .and("be.visible");

        cy.get("button").contains("Add to Basket").should("exist");
      });
  });

  // Test Case #6
  it("should find product by lowercase code", () => {
    cy.searchFor(product.productCode.toLowerCase());

    cy.get("#productList .product-card").contains(product.productCode);
  });
  //Test case #7
  it("should find product by uppercase description", () => {
    cy.searchFor(product.description.toUpperCase());
    cy.get("#productList .product-card").contains(product.description);
  });
  //Test case #8
  it("should find product by combination of upper and lower case description", () => {
    const mixedCase = product.description
      .split("")
      .map((char, i) => (i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
      .join("");
    cy.searchFor(mixedCase);
    cy.get("#productList .product-card").contains(product.description);
  });

  //Test case #9

  it("should correctly filter and display matching products when only 2 characters from product code or description are given)", () => {
    const codeSubstring = product.productCode.charAt(2, 4);
    const descriptionSubstring = product.description.substring(5, 7);

    const expectedByCode = products
      .filter((p) => p.productCode.includes(codeSubstring))
      .sort((a, b) => a.productCode.localeCompare(b.productCode));

    cy.searchFor(codeSubstring);

    cy.get(".product-card").should("have.length", expectedByCode.length);

    expectedByCode.forEach((product) => {
      cy.get(".product-card")
        .contains(product.description)
        .should("be.visible");
    });

    const expectedByDescription = products
      .filter((p) => p.description.includes(descriptionSubstring))
      .sort((a, b) => a.productCode.localeCompare(b.productCode));

    cy.searchFor(descriptionSubstring);

    cy.get(".product-card").should("have.length", expectedByDescription.length);

    expectedByDescription.forEach((product) => {
      cy.get(".product-card")
        .contains(product.description)
        .should("be.visible");
    });
  });

  //Test Case #10
  const matchDescription = "Fresh";
  it(`should displays all products that matches the descriptions in serach field and are sorted by product code "${matchDescription}"`, () => {
    const matchingProducts = products
      .filter((p) => p.description.includes(matchDescription))
      .sort((a, b) => a.productCode.localeCompare(b.productCode));

    cy.searchFor(matchDescription);

    cy.get(".product-card").should("have.length", matchingProducts.length);
    matchingProducts.forEach((product) => {
      cy.get(".product-card")
        .contains(product.description)
        .should("be.visible");

      cy.get(".product-card").then(($cards) => {
        const actualCodes = [...$cards].map((card) => {
          const codeText = card.innerText.match(/Code:\s*(P\d+)/i);
          return codeText ? codeText[1] : null;
        });

        const expectedCodes = matchingProducts.map((p) => p.productCode);
        expect(actualCodes).to.deep.equal(expectedCodes);
      });
    });
  });
  //Test case #11
  invalidSearchValues.forEach((value) => {
    it(`should not filter products when searching with price or qty or unit or with product name or code that doesn’t exist.: "${value}"`, () => {
      cy.searchFor(value);

      cy.get("#productList .product-card").should("have.length", 0);
    });
  });

  //Test case #12

  it("should add first and last product to basket through scroll,show alert ", () => {
    cy.window().then((win) => cy.stub(win, "alert").as("alert"));
    cy.get(".product-card").first().contains("Add to Basket").click();
    cy.get("@alert").should("have.been.calledWithMatch", /added to basket/i);
    cy.get(".product-card")
      .last()
      .scrollIntoView()
      .within(() => {
        cy.contains("Add to Basket").click();
      });

    cy.window().then((win) => {
      const basket = JSON.parse(win.localStorage.getItem("basket"));
      expect(basket).to.have.length.greaterThan(0);
      const addedProduct = basket.find(
        (item) => item.productCode === lastProduct.productCode
      );
      cy.log("Added Product:", addedProduct);
      expect(addedProduct).to.exist;
    });
  });

  //Test case #13
  it("should redirected user to basket screen when clciked on view basket", () => {
    cy.contains("View Basket").click();
    cy.url().should("include", "http://127.0.0.1:5500/public/basket.html");
  });

  //Test case #14
  it("should logout and redirect user to login screen and clear the values in basket", () => {
    cy.get(".product-card").eq(4).contains("Add to Basket").click();
    cy.logoutAndVerifyClearedBasket();
  });
});
