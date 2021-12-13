import cart from "../pages/cart";
import inventory from "../pages/inventory";
import login from "../pages/login";
import data from "./data";
import localisations from "./localisations";

const Faker = require('faker');

const helper = {
    genRandomNumber: (min, max) => {
        return Faker.datatype.number({min: min, max: max});
    },

    genFirstName: () => {
        return Faker.name.firstName()
    },

    genLastName: () => {
        return Faker.name.lastName()
    },

    genPostIndex: () => {
        return Faker.address.zipCode()
    },

    getPriceNum: (price) => {
        return Number(price.replace('$', ''))
    },

    genUrl: (page) => {
        return `${data.url}/${page}.html`
    },

    checkItemDetails: (name, descr, price, quantity, index) => {
        cy.get(cart.cartItem).eq(index).then(function (item) {
            cy.wrap(item).find(inventory.itemLabel).should('contain.text', name)
            cy.wrap(item).find(inventory.itemDescription).should('contain.text', descr)
            cy.wrap(item).find(inventory.priceTag).should('contain.text', price)
            cy.wrap(item).find(cart.itemQuantity).should('contain.text', quantity)
        })
    },

    validateElements: (obj) => {
        for (let key in obj) {
            cy.get(obj[key]).should('be.visible');
        }
    },

    loginUser: (userName = data.standardUsername, password = data.password) => {
        cy.get(login.userInput).type(userName);
        cy.get(login.passwordInput).type(password);
        cy.get(login.loginBtn).click();
    },

    selectProduct: (id) => {
        let productDetails = {}
        cy.get(inventory.item).eq(id).then(function (item) {
            cy.wrap(item).find(inventory.itemLabel).then(function (label) {
                productDetails.itemName = label.text();
            })
            cy.wrap(item).find(inventory.itemDescription).then(function (descr) {
                productDetails.itemDescr = descr.text();
            })
            cy.wrap(item).find(inventory.priceTag).then(function (price) {
                productDetails.itemPrice = price.text();
            })
            cy.wrap(item).find(inventory.inventoryBtn).contains(localisations.addToCart).should('be.visible').click();
        })
        return productDetails;
    },

    genUserData: function (){
        return {
            firstName: this.genFirstName(),
            lastName: this.genLastName(),
            postCode: this.genPostIndex(),
        }
    }
}

export default {...helper}