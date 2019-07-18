/* tslint:disable */
export const TIERS = [
  {
    level: 0,
    description: 'Deposits and withdrawal are the same as the app.',
    daily: {
      deposit: {
        fiat: 0.00,
        crypto: 'No Limit',
      },
      withdraw: {
        fiat: 0.00,
        crypto: 2000,
      },
    },
    monthly: {
      deposit: {
        fiat: 0.00,
        crypto: 'No Limit',
      },
      withdraw: {
        fiat: 0.00,
        crypto: 10000,
      },
    },
    requirements: {
      type: 'check-list',
      items: [
        'Account',
        'Validate Phone',
        'Sign up'
      ],
      items_props: {
        'Account': ['created'],
        'Validate Mail': ['kyc_validations.phone_validated'],
        'Sign up': ['created'],
      },
    },
    verification: true,
  },
  {
    level: 1,
    description: 'You can trade between all currencies, fiat operations are limited.',
    daily: {
      deposit: {
        fiat: 0.00,
        crypto: 'No Limit',
      },
      withdraw: {
        fiat: 0.00,
        crypto: 5000.00,
      },
    },
    monthly: {
      deposit: {
        fiat: 0.00,
        crypto: 'No Limit',
      },
      withdraw: {
        fiat: 0.00,
        crypto: 20000.00,
      },
    },
    requirements: {
      type: 'list',
      items: [
        'Name',
        'Last Name',
        'Date of Birth',
        'Country of residence',
        'Phone Number',
        // "Address",
        'Identity Document'
      ],
      items_props: {
        'Name': ['name'],
        'Last Name': ['kyc_validations.last_name'],
        'Date of Birth': ['kyc_validations.date_birth'],
        'Country of residence': ['kyc_validations.country'],
        'Phone Number': ['kyc_validations.phone'],
        // "Address": ["kyc_validations.address"],
        'Identity Document': ['kyc_validations.card_info'],
      },
    },
    verification: true,
  },
  {
    level: 2,
    description: 'Increase your limits.',
    daily: {
      deposit: {
        fiat: 2000.00,
        crypto: 'No Limit',
      },
      withdraw: {
        fiat: 2000.00,
        crypto: 5000.00,
      },
    },
    monthly: {
      deposit: {
        fiat: 10000.00,
        crypto: 'No Limit',
      },
      withdraw: {
        fiat: 10000.00,
        crypto: 50000.00,
      },
    },
    requirements: {
      type: 'list',
      items: [
        'All of the previous',
        'Address verification',
        'Verified Proof of Residence'
      ],
    },
    verification: true,
  },
  {
    daily: {
      deposit: {
        crypto: 'No Limit',
        fiat: 25000.00,
      },
      withdraw: {
        crypto: 50000.00,
        fiat: 25000.00,
      },
    },
    description: 'Individual High Value Account or Corporate Account.',
    level: 3,
    monthly: {
      deposit: {
        crypto: 'No Limit',
        fiat: 200000.00,
      },
      withdraw: {
        crypto: 200000.00,
        fiat: 200000.00,
      },
    },
    requirements: {
      items: [
        'All of the previous',
        'Contact us',
      ],
      type: 'list',
    },
    verification: true,
  },
];
