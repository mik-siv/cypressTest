import login from '../pages/login';
import inventory from '../pages/inventory'
import data from '../support/data';
import helper from "../support/helper";
import localisations from "../support/localisations";
import cart from "../pages/cart"
import checkout from "../pages/checkout";
import checkout2 from "../pages/checkoutSecondPage";
import orderFinish from "../pages/orderFinish";

let randomProduct = helper.genRandomNumber(0, data.inventoryProductsCount - 1);
let secondProduct = helper.genRandomNumber(0, data.inventoryProductsCount - 1);
//insuring the second product is unique
while (secondProduct === randomProduct) {
    secondProduct = helper.genRandomNumber(0, data.inventoryProductsCount - 1);
}
let item1 = {
    itemName: null,
    itemDescr: null,
    itemPrice: null
}

let item2 = {
    itemName: null,
    itemDescr: null,
    itemPrice: null
}
let itemCount = 2;
let firstName = helper.genFirstName();
let lastName = helper.genLastName();
let postCode = helper.genPostIndex();
let totalAmount;

describe('SauceDemo purchase flow', function () {
    //saving local storage in between tests
    beforeEach(() => {
        cy.restoreLocalStorage();
    });
    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('Open website', function () {
        cy.visit(data.url);
    });

    it('Validate login page elements', function () {
        cy.url().should('eq', `${data.url}/`)
        for (let key in login) {
            cy.get(login[key]).should('be.visible');
        }
    });

    it('Log in', function () {
        cy.get(login.userInput).type(data.standardUsername);
        cy.get(login.passwordInput).type(data.password);
        cy.get(login.loginBtn).click();
    });

    it('Validate inventory page elements', function () {
        cy.url().should('eq', `${data.url}/inventory.html`);
        cy.get(inventory.item).should('have.length', data.inventoryProductsCount);
        for (let key in inventory) {
            cy.get(inventory[key]).should('be.visible');
        }
    });

    it('Choose a product', function () {
        cy.get(inventory.item).eq(randomProduct).then(function (item) {
            cy.wrap(item).find(inventory.itemLabel).then(function (label) {
                item1.itemName = label.text();
            })
            cy.wrap(item).find(inventory.itemDescription).then(function (descr) {
                item1.itemDescr = descr.text();
            })
            cy.wrap(item).find(inventory.priceTag).then(function (price) {
                item1.itemPrice = price.text();
            })
            cy.wrap(item).find(inventory.inventoryBtn).contains(localisations.addToCart).should('be.visible').click();
        })
    });

    it('Choose a second product', function () {
        cy.get(inventory.item).eq(secondProduct).then(function (item) {
            cy.wrap(item).find(inventory.itemLabel).then(function (label) {
                item2.itemName = label.text();
            })
            cy.wrap(item).find(inventory.itemDescription).then(function (descr) {
                item2.itemDescr = descr.text();
            })
            cy.wrap(item).find(inventory.priceTag).then(function (price) {
                item2.itemPrice = price.text();
            })
            cy.wrap(item).find(inventory.addToCartBtn).should('be.visible').click();
        })
        cy.get(inventory.item).eq(secondProduct).then(function (item) {
            cy.wrap(item).find(inventory.inventoryBtn).contains(localisations.removeFromCart).should('be.visible').click();
            cy.wrap(item).find(inventory.inventoryBtn).contains(localisations.addToCart).should('be.visible').click();
        })
    });

    it('Continue to cart', function () {
        cy.get(inventory.cart).should('contain.text', itemCount).click();
        cy.url().should('eq', `${data.url}/cart.html`);
    });

    it('Validate cart page elements', function () {
        cy.url().should('eq', `${data.url}/cart.html`);
        cy.get(cart.cartItem).should('have.length', itemCount);
        for (let key in cart) {
            cy.get(cart[key]).should('be.visible');
        }
        cy.get(cart.title).should('contain.text', localisations.cart);
    });

    it('Check cart items', function () {
        helper.checkItemDetails(item1.itemName, item1.itemDescr, item1.itemPrice, 1, 0);
        helper.checkItemDetails(item2.itemName, item2.itemDescr, item2.itemPrice, 1, 1);
    });

    it('Proceed to checkout', function () {
        cy.get(cart.continueShoppingBtn).should('contain.text', localisations.continueShoppingBtn)
        cy.get(cart.checkoutBtn).should('contain.text', localisations.checkoutBtn).click();
    });

    it('Validate checkout page elements', function () {
        cy.url().should('eq', `${data.url}/checkout-step-one.html`);
        for (let key in checkout) {
            cy.get(checkout[key]).should('be.visible');
        }
        cy.get(checkout.title).should('contain.text', localisations.checkout);
        cy.get(checkout.cancelBtn).should('contain.text', localisations.cancelBtn);
        cy.get(checkout.continueBtn).should('contain', localisations.continueBtn);
    });

    it('First checkout step', function () {
        cy.get(checkout.continueBtn).click();
        cy.contains(localisations.errorMissingCustomer).should('be.visible');
        cy.get(checkout.firstName).type(firstName);
        cy.get(checkout.lastName).type(lastName);
        cy.get(checkout.index).type(postCode);
        cy.get(checkout.continueBtn).click();
    });

    it('Validate checkout page two elements', function () {
        totalAmount = helper.getPriceNum(item1.itemPrice) + helper.getPriceNum(item2.itemPrice);
        cy.url().should('eq', `${data.url}/checkout-step-two.html`);
        for (let key in checkout2) {
            cy.get(checkout2[key]).should('be.visible');
        }
        cy.get(checkout2.title).should('contain.text', localisations.checkoutOverview);
        cy.get(checkout2.summaryLabel).contains(localisations.paymentInfo).should('be.visible');
        cy.get(checkout2.summaryLabel).contains(localisations.shippingInfo).should('be.visible');
        helper.checkItemDetails(item1.itemName, item1.itemDescr, item1.itemPrice, 1, 0);
        helper.checkItemDetails(item2.itemName, item2.itemDescr, item2.itemPrice, 1, 1);
        cy.get(checkout2.subtotal).should('contain.text', `${localisations.subtotal}${totalAmount}`);
        cy.contains(checkout2.tax, localisations.tax).should('be.visible');
        cy.contains(checkout2.total, localisations.total).should('be.visible');
        cy.get(checkout2.finishBtn).click();
    });

    it('Validate order finish screen', function () {
        cy.url().should('eq', `${data.url}/checkout-complete.html`);
        for (let key in orderFinish) {
            cy.get(orderFinish[key]).should('be.visible');
        }
        cy.get(orderFinish.title).should('contain.text', localisations.orderFinish);
        cy.get(orderFinish.completeHeader).should('contain.text', localisations.thanks);
        cy.get(orderFinish.completeText).should('contain.text', localisations.orderInfo);
        cy.get(orderFinish.backHomeBtn).should('contain.text', localisations.backHomeBtn).click();
        cy.url().should('eq', `${data.url}/inventory.html`);
    });

});
