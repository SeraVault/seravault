AppPlans.define('free'), {
  services: []
}

AppPlans.define('silver', {
  services: [
    {
      name: 'stripe', // External plan is on Stripe
      planName: 'silver', // External plan ID is "silver"
      // Options for the Stripe Checkout flow on the client
      payOptions: {
        name: 'Silver Plan',
        description: '$9.99/year',
        amount: 9.99
      }
    }
  ],
  includedPlans: ['free']
});

AppPlans.define('gold', {
  services: [
    {
      name: 'stripe', // External plan is on Stripe
      planName: 'gold', // External plan ID is "silver"
      // Options for the Stripe Checkout flow on the client
      payOptions: {
        name: 'Gold Plan',
        description: '$19.99/year',
        amount: 1999
      }
    }
  ],
  includedPlans: ['free', 'silver']
});

plan = function() {
  if (AppPlans.hasAccess("gold")) {
    return {
      items: 10000,
      disk: 21474836480 //20gb
    };
  }
  if (AppPlans.hasAccess("silver")) {
    return {
      items: 1000,
      disk: 10737418240 //10gb
    };
  }
  if (AppPlans.hasAccess('free')) {
    return {
      items: 50,
      disk: 52428800 //50mb
    };
  }
};
