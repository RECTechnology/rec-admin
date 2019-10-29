import { Account } from './account.ent';
import { Transaction } from './transaction.ent';
import { Neighborhood } from './translatable/neighborhood.ent';

export interface KycValidations {
    last_name: string;
    data_birth: string;
    street_type: string;
    street_name: string;
    street_number: string | number;
    country: string;
    city: string;
    zip: string;
    neighbourhood: Neighborhood;

    document_front: string;
    document_back: string;
}

export interface User {
    access_key: string;
    access_secret: string;
    active_group: Account;
    accounts: Account[];
    created: string;
    company_image: string;
    dni: string;
    email: string;
    expired: boolean;
    group_data: Account;
    has_saved_cards: boolean;
    id: number;
    kyc_validations: KycValidations;
    locked: boolean;
    locale: string;
    name: string;
    phone: string;
    prefix: number;
    profile_image: string;
    public_phone: boolean;
    roles: string[];
    treasure_validations: any[];
    two_factor_authentication: boolean;
    two_factor_code: string;
    username: string;

    transactions: Transaction[];
    _isAdmin: boolean;
    _isReadonly: boolean;
    _isCompany: boolean;
}

export class User implements User {

    public static ROLE_USER = 'ROLE_USER';
    public static ROLE_ADMIN = 'ROLE_ADMIN';
    public static ROLE_MANAGER = 'ROLE_MANAGER';
    public static ROLE_WORKER = 'ROLE_WORKER';
    public static ROLE_READONLY = 'ROLE_READONLY';

    constructor(userInfo?: User) {
        for (const prop in userInfo) {
            if (prop === 'active_group') {
                this.active_group = new Account(userInfo[prop]);
            } else if (prop === 'group_data') {
                this.group_data = new Account(userInfo[prop]);
            } else if (prop === 'accounts') {
                this.accounts = userInfo[prop].map((el) => new Account(el));
            } else {
                this[prop] = userInfo[prop];
            }
        }

        console.log('User', this);

        this._isAdmin = this.isAdmin();
        this._isReadonly = this.isReadonly();
        this._isCompany = this.isCompany();
    }

    /**
     * Check if kyc data is fullfilled
     */
    public isKycValidated() {
        const props = [
            'name',
            'last_name',
            'date_birth',
            'address',
            'street_type',
            'street_number',
            'street_name',
        ];

        const areFullFilled = props
            .map((p) => this.kyc_validations[p])
            .reduce((prev, curr) => !!prev);
        return areFullFilled;
    }

    public isCompany() {
        return this.active_group && this.active_group.type === 'COMPANY';
    }

    public isAdmin() {
        return this.roles ? this.roles.indexOf(User.ROLE_ADMIN) !== -1 : false;
    }

    public isReadonly() {
        return this.roles ? this.roles.indexOf(User.ROLE_READONLY) !== -1 : false;
    }
}
