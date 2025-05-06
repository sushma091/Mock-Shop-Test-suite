//----------- Command for login --------
Cypress.Commands.add('login', (username = 'user1', password = 'user1') => {
    cy.visit('http://127.0.0.1:5500/public/index.html');
    cy.get('input[name="username"]').type('user1');
    cy.get('input[name="password"]').type('user1');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', 'http://127.0.0.1:5500/public/shop.html'); 
  });
  

//-------- Command for search filter-----

Cypress.Commands.add('searchFor', (value) => {
  cy.get('#searchInput').clear().type(value);
  cy.contains('Search').click();
});

//--- command to verify basket is not empty-----
Cypress.Commands.add('verifyBasketIsNotEmpty', () => {
  cy.window().then((win) => {
    const basket = JSON.parse(win.localStorage.getItem('basket') || '[]');
    cy.log('Basket before logout:', basket);
    expect(basket).to.be.an('array').that.is.not.empty;
  });
});

// ----Command to verify basket is cleared after logout ----
Cypress.Commands.add('verifyBasketIsClearedAfterLogout', () => {
  cy.window().then((win) => {
    const basketString = win.localStorage.getItem('basket');

    if (basketString === null) {
      cy.log('Basket key is removed from localStorage');
      expect(basketString).to.be.null;
    } else {
      const basket = JSON.parse(basketString);
      cy.log('Basket after logout:', basket);
      expect(basket).to.be.an('array').that.is.empty;
    }
  });
});

// ---- Command to handle logut and clear basket combined-------
Cypress.Commands.add('logoutAndVerifyClearedBasket', () => {
  cy.verifyBasketIsNotEmpty();
  cy.contains('Logout').click();
  cy.url().should('include', 'index.html');
  cy.verifyBasketIsClearedAfterLogout();
});

//------- Command to verify the basket toatl ------
Cypress.Commands.add('verifyBasketTotal', () => {
  let total = 0;

  cy.get('#basketList .product-card').then(($cards) => {
    $cards.each((index, el) => {
      const price = parseFloat(Cypress.$(el).find('p:contains("Price")').text().replace(/[^0-9.]/g, ''));
      const qty = parseInt(Cypress.$(el).find('p:contains("Qty in Basket")').text().replace(/\D/g, ''), 10);
      total += price * qty;
    });
    cy.get('#basketTotal').invoke('text').then((text) => {
      const displayedTotal = parseFloat(text.replace(/[^\d.]/g, ''));
      expect(displayedTotal).to.be.closeTo(total, 0.01);
    });
  });
});