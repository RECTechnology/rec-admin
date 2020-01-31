export const SIDEMENU_ITEMS = [
    {
        name: 'ADMIN',
        type: 'separator',
        icon: false,
    },
    {
        name: 'Dashboard',
        icon: 'fa-tachometer',
        route: '/dashboard',
    },
    {
        name: 'UsersAndAccounts',
        type: 'dropdown',
        icon: 'fa-users-cog',
        children: [
            {
                name: 'Users',
                icon: 'fa-user',
                route: '/users',
            },
            {
                name: 'Accounts',
                icon: 'fa-group',
                route: '/accounts',
            },
            {
                name: 'BUSSINESES',
                icon: 'fa-building',
                route: '/organizations',
            },
        ],
    },
    {
        name: 'Transactions',
        icon: 'fa-exchange',
        route: '/transactions',
    },
    {
        name: 'REC_ENTITIES',
        icon: 'fa-cog',
        route: '/b2b/settings',
    },
    {
        name: 'SPECIAL_ACTIONS',
        type: 'separator',
        icon: false,
    },
    {
        name: 'CHANGE_DELEGATE',
        icon: 'fa-calendar-alt',
        route: '/change_delegate',
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
    },
];
