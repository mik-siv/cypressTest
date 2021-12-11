const localisations = {
    addToCart: 'Add to cart',
    removeFromCart: 'Remove',
    //cart
    continueShoppingBtn: 'Continue Shopping',
    checkoutBtn: 'Checkout',
    cart: 'Your Cart',
    //checkout step 1
    checkout: 'Checkout: Your Information',
    errorMissingCustomer: 'Error: First Name is required',
    cancelBtn: 'Cancel',
    continueBtn: 'Continue',
    //checkout step 2
    checkoutOverview: 'Checkout: Overview',
    paymentInfo: 'Payment Information:',
    shippingInfo: 'Shipping Information:',
    cardInfo: /SauceCard #\d\d\d\d\d/,
    deliveryMethodInfo: 'FREE PONY EXPRESS DELIVERY!',
    subtotal: 'Item total: $',
    tax: /Tax: \$[0-9]*\.[0-9]+/,
    total: /Total: \$[0-9]*\.[0-9]+/,
    //order finish
    orderFinish: 'Checkout: Complete!',
    thanks: 'THANK YOU FOR YOUR ORDER',
    orderInfo: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    backHomeBtn: 'Back Home',
}

export default {...localisations}