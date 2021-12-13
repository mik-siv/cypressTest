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
let secondProduct;
//insuring the second product is unique
do {
    secondProduct = helper.genRandomNumber(0, data.inventoryProductsCount - 1);
}
while (secondProduct === randomProduct);

let item1 = {};
let item2 = {};
let itemCount = 2;
let userData = {...helper.genUserData()};
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
        helper.validateElements(login);
    });

    it('Log in', function () {
        helper.loginUser()
    });

    it('Validate inventory page elements', function () {
        cy.url().should('eq', helper.genUrl('inventory'));
        cy.get(inventory.item).should('have.length', data.inventoryProductsCount);
        helper.validateElements(inventory);
    });

    it('Choose a product', function () {
        item1 = helper.selectProduct(randomProduct);
    });

    it('Choose a second product', function () {
        item2 = helper.selectProduct(secondProduct);
        cy.get(inventory.item).eq(secondProduct).then(function (item) {
            cy.wrap(item).find(inventory.inventoryBtn).contains(localisations.removeFromCart).should('be.visible').click();
            cy.wrap(item).find(inventory.inventoryBtn).contains(localisations.addToCart).should('be.visible').click();
        })
    });

    it('Continue to cart', function () {
        cy.get(inventory.cart).should('contain.text', itemCount).click();
        cy.url().should('eq', helper.genUrl('cart'));
    });

    it('Validate cart page elements', function () {
        cy.get(cart.cartItem).should('have.length', itemCount);
        cy.get(cart.title).should('contain.text', localisations.cart);
        helper.validateElements(cart);
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
        cy.url().should('eq', helper.genUrl('checkout-step-one'));
        cy.get(checkout.title).should('contain.text', localisations.checkout);
        cy.get(checkout.cancelBtn).should('contain.text', localisations.cancelBtn);
        cy.get(checkout.continueBtn).should('contain', localisations.continueBtn);
        helper.validateElements(checkout);
    });

    it('First checkout step', function () {
        cy.get(checkout.continueBtn).click();
        cy.contains(localisations.errorMissingCustomer).should('be.visible');
        cy.get(checkout.firstName).type(userData.firstName);
        cy.get(checkout.lastName).type(userData.lastName);
        cy.get(checkout.index).type(userData.postCode);
        cy.get(checkout.continueBtn).click();
    });

    it('Validate checkout page two elements', function () {
        totalAmount = helper.getPriceNum(item1.itemPrice) + helper.getPriceNum(item2.itemPrice);
        cy.url().should('eq', helper.genUrl('checkout-step-two'));
        helper.validateElements(checkout2);
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
        cy.url().should('eq', helper.genUrl('checkout-complete'));
        helper.validateElements(orderFinish);
        cy.get(orderFinish.title).should('contain.text', localisations.orderFinish);
        cy.get(orderFinish.completeHeader).should('contain.text', localisations.thanks);
        cy.get(orderFinish.completeText).should('contain.text', localisations.orderInfo);
    });

    it('Return to home', function () {
        cy.get(orderFinish.backHomeBtn).should('contain.text', localisations.backHomeBtn).click();
        cy.url().should('eq', helper.genUrl('inventory'));
    });
});
