# Mock Shop Automation Test Suite
Created an automation test suite for mock shop website
**Author**: Sushma Malampati

## > Setup Instructions

### Step 1: Setup Prerequisites

- Install and set up **Node.js**.
- Install and set up **Cypress**.
- Install **Live Server** in Visual Studio Code.

### Step 2: Import Scripts

- Import the following files into the `e2e` folder in Cypress:
  1. `login.cy.js`
  2. `shop.cy.js`
  3. `basket.cy.js`
- Import the `products.js` file into the `fixtures` folder.
- Import the `commands.js` file into the `support` folder.

### Step 3: Run

- Start **Live Server**.
- Run the command `npx cypress open`.
- Choose the required spec file to run in the test runner.

---

## > Test Cases

### Login Page

**Before Each:** User lands on the login screen.

1. Verify the presence of the **Login title**, **Username** and **Password** input fields, and the **Login** button.
2. Log in with a valid username and password, then log out successfully.
3. User should not be able to log in with invalid username and password credentials.
4. Verify that an error is displayed when the username is entered in a case-sensitive manner.
5. User should not be able to log in with a valid username and an invalid password.
6. User should not be able to log in with an invalid username and a valid password.
7. When the user clicks the browser **Back** button, they should land on the **Login** screen.

### Shop Page

**Before Each:** User lands on the Shop screen.

1. Verify that the **Shop title**, **Search input box**, **Search**, **View Basket**, and **Logout** buttons are displayed.
2. Verify that all 6 products are displayed when the user redirects to the shop screen.
3. Verify that each product has an image, name, code, price, unit, quantity, and an **Add to Basket** button.
4. Verify that the search works by product code. Clear the search input values and display all products when the user clicks the **Search** button.
5. Verify that the user can filter products by description in the search bar and that the product details match the search query.
6. Verify that the search bar can filter by product code when entered in **lowercase**.
7. Verify that the search bar can filter by product description when entered in **uppercase**.
8. Verify that the search bar can filter by product description when a combination of **uppercase** and **lowercase** is used.
9. Verify that the search bar can filter products when 2 character are passed from product code and product name .
10. Verify that all products matching the exact text in the search field are displayed and sorted by product code.
11. Verify that the user cannot search by price, quantity, unit, or any other non-existent field.
12. When a product is added to the basket, an alert should be displayed on the screen, and the user should be able to scroll down to add a new product to the basket.
13. When the user clicks on **View Basket**, they should be redirected to the **Basket** screen.
14. When the user clicks on **Logout**, they should be redirected to the **Login** screen, and the basket values should be cleared.

### Basket Page

**Before Each:** User lands on the Basket screen with pre-selected products.

1. Verify that all selected products are displayed on the Basket screen.
2. Verify the product details and quantities in the basket.
3. Verify that the correct total price is displayed for the added products.
4. Verify that the correct quantity and total price are displayed when the same product is added multiple times.
5. When all products are added to the cart on the shop page, verify that the same product details are validated on the basket screen.
6. Verify that when the user clicks **Clear Basket**, it removes all the products and displays a **Basket Cleared** message.
7. Verify that the page title, **Basket Empty** message, total price of `$0.00`, **Back to Shop**, **Clear Basket**, and **Logout** buttons are displayed.
8. Verify that when the user clicks **Back to Shop**, they are redirected to the Shop screen.
9. Verify that when the user logs out, the basket is cleared, and the user is logged out.

---

## > Observations

### Login Page

1. When the user enters invalid credentials, the values are not cleared from the username and password fields. The user needs to manually remove them or refresh the browser.
2. When the user clicks **Login** without entering any credentials, it would be better to display **“Please enter the username or password”** instead of the generic DOM statement **“Fill out this field.”**
3. After a successful login, when the user clicks the browser **Back** button, they are redirected to the **Login** screen. However, the user ID fields still contain the previously entered values, and the error messages from failed attempts are still visible on the Login screen.
4. The page doesn’t seem to refresh when 2 or more invalid login attempts are made.
5. The user is allowed an infinite number of retries for invalid attempts.
6. The username might not need to be case-sensitive.

### Shop Page

1. The length of the search field is too large. It would be better if it were shortened, and the **View Basket** and **Logout** buttons were aligned to the top-right corner for a better user experience.
2. It would be helpful to display the total count of items added to the cart next to the **View Basket** button.
3. There is misalignment in the **code**, **price**, **UOM**, and **quantity** fields.
4. No error is displayed when the quantity in the basket exceeds the quantity available on the Shop page.
5. There is no clear direction for the user to return to the Shop page after a specific product search.
6. When an invalid product is searched, no message is displayed (e.g., **“No products found”**).

### Basket Page

1. The unit for Apples is displayed incorrectly on the Basket page (it shows **g** instead of **kg**), and the price is reduced by 20 cents.
2. There is misalignment of product details in the Basket.
3. When the product quantity in the Basket exceeds the quantity available on the Shop page, no errors are displayed informing the user of the exceeded quantity.
4. There is no option for the user to remove only one product from the Basket.
5. There is no option for the user to decrease or increase the quantity directly in the Basket page.

---
