export const SIDEMENU_ITEMS = [
  {
    name: 'ADMIN',
    type: 'separator',
    icon: false,
    hide: false
  },
  {
    name: 'Dashboard',
    icon: 'fa-tachometer',
    route: '/dashboard',
    hide: false
  },
  {
    name: 'UsersAndAccounts',
    type: 'dropdown',
    icon: 'fa-users-cog',
    hide: false,
    children: [
      {
        name: 'Users',
        icon: 'fa-user',
        route: '/users',
        hide: false
      },
      {
        name: 'Accounts',
        icon: 'fa-group',
        route: '/accounts',
        hide: false
      },
      {
        name: 'BUSSINESES',
        icon: 'fa-building',
        route: '/organizations',
        hide: false
      },
    ],
  },
  {
    name: 'Transactions',
    icon: 'fa-exchange',
    route: '/transactions',
    hide: false
  },
  {
    name: 'CHALLENGES',
    route: '/challenges',
    icon: 'fa-people-group',
  },
  {
    name: 'Ratings',
    route: '/ratings',
    icon: 'fa-star',
    hide: true
  },
  {
    name: 'REC_ENTITIES',
    icon: 'fa-cog',
    route: '/b2b/settings',
    hide: false
  },
  {
    name: 'SPECIAL_ACTIONS',
    type: 'separator',
    icon: false,
    hide: false
  },

  {
    name: 'TRANSACTION_BLOCK',
    icon: 'fa-calendar-alt',
    route: '/txs_blocks',
  },
  {
    name: 'B2B',
    icon: 'fa-exchange',
    route: '/b2b',
    hide: true
  },
  {
    name: 'CREATE_RECS',
    icon: 'fa-cash-register',
    route: '/treasure_account',
  },
  {
    name: 'REC_MAILING',
    route: '/rec/mailing',
    isBeta: true,
    icon: 'fa-mail-bulk',
    hide: true
  },
  {
    name: 'CAMPAIGN_REPORTS',
    route: '/campaign_reports',
    icon: 'fa-envelope-open-text',
    hide: true
  },
];
