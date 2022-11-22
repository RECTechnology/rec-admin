export const SIDEMENU_ITEMS = [
  {
    name: 'ADMIN',
    type: 'separator',
    item:'',
    icon: false,
    hide: false
  },
  {
    name: 'Dashboard',
    icon: 'fa-tachometer',
    item:'',
    route: '/dashboard',
    hide: false
  },
  {
    name: 'UsersAndAccounts',
    type: 'dropdown',
    item:'',
    icon: 'fa-users-cog',
    hide: false,
    children: [
      {
        name: 'Users',
        icon: 'fa-user',
        item:'',
        route: '/users',
        hide: false
      },
      {
        name: 'Accounts',
        icon: 'fa-group',
        item:'',
        route: '/accounts',
        hide: false
      },
      {
        name: 'BUSSINESES',
        icon: 'fa-building',
        item:'',
        route: '/organizations',
        hide: false
      },
    ],
  },
  {
    name: 'Transactions',
    icon: 'fa-exchange',
    item:'',
    route: '/transactions',
    hide: false
  },
  {
    name: 'CHALLENGES',
    route: '/challenges',
    item: 'menu_item_challenges',
    hide: true,
    icon: 'fa-people-group',
  },
  {
    name: 'Ratings',
    route: '/ratings',
    item: 'menu_item_qualifications',
    icon: 'fa-star',
    hide: true
  },
  {
    name: 'REC_ENTITIES',
    icon: 'fa-cog',
    item: '',
    route: '/b2b/settings',
    hide: false
  },
  {
    name: 'SPECIAL_ACTIONS',
    type: 'separator',
    item: '',
    icon: false,
    hide: false
  },

  {
    name: 'TRANSACTION_BLOCK',
    icon: 'fa-calendar-alt',
    item: '',
    route: '/txs_blocks',
  },
  {
    name: 'B2B',
    icon: 'fa-exchange',
    item: 'menu_item_b2b',
    route: '/b2b',
    hide: true
  },
  {
    name: 'CREATE_RECS',
    icon: 'fa-cash-register',
    item: '',
    route: '/treasure_account',
  },
  {
    name: 'REC_MAILING',
    route: '/rec/mailing',
    item:'menu_item_email',
    isBeta: true,
    icon: 'fa-mail-bulk',
    hide: true
  },
  {
    name: 'CAMPAIGN_REPORTS',
    route: '/campaign_reports',
    item:'menu_item_reports',
    icon: 'fa-envelope-open-text',
    hide: true
  },
  {
    name: 'PARAMETRIZATION',
    route: '/parametrization',
    item: '',
    icon: 'fa-sliders',
  },
];
