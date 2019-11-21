import { User } from './user.ent';
import { Wallet } from './wallet.ent';
import { Activity } from './translatable/activity.ent';
import { Product } from './translatable/product.ent';

export type AccountType = 'PRIVATE' | 'COMPANY';
export type AccountSubtype = 'RETAILER' | 'WHOLESALE' | 'NORMAL' | 'BMINCOME';

export interface Category {
    id: 6;
    cat: 'Vestit i calçat';
    eng: 'Clothes and footwear';
    esp: 'Ropa y calzado';
}

export interface Account {
    access_key: string;
    access_secret: string;
    active: boolean;
    address_number: string;
    allowed_methods: any[];
    association: string;

    activities: Activity[];
    producing_products: Product[];
    consuming_products: Product[];

    cash_in_tokens: any[];
    category: Category;
    cif: string;
    city: string;
    comment: string;
    commissions: any[];
    company_image: string;
    company_token: string;
    country: string;
    description: string;
    email: string;
    fixed_location: true;
    id: number;
    kyc_manager: User;
    latitude: number;
    lemon_id: string;
    limit_configuration: any[];
    limit_counts: any[];
    limits: any[];
    longitude: number;
    name: string;
    needed_products: string;
    neighborhood: string;
    observations: string;
    offer_count: number;
    offered_products: string;
    offers: any[];
    on_map: true;
    phone: string;
    prefix: string;
    public_image: string;
    rec_address: string;
    roles: string[];
    schedule: string;
    street: string;
    street_type: string;
    subtype: AccountSubtype;
    tier: number;
    type: AccountType;
    wallets: Wallet[];
    web: string;
    zip: string;
    lw_balance: number;

    _isReadonly?: boolean;
    _isCompany?: boolean;
    _isAdmin?: boolean;
}
export class Account implements Account {

    public static TYPE_COMPANY: AccountType = 'COMPANY';
    public static TYPE_PRIVATE: AccountType = 'PRIVATE';

    public static SUBTYPE_COMPANY_RETAILER: AccountSubtype = 'RETAILER';
    public static SUBTYPE_COMPANY_WHOLESALE: AccountSubtype = 'WHOLESALE';

    public static SUBTYPE_COMPANY_NORMAL: AccountSubtype = 'NORMAL';
    public static SUBTYPE_COMPANY_BMINCOME: AccountSubtype = 'BMINCOME';

    constructor(accountInfo?: Account) {
        for (const prop in accountInfo) {
            if (prop === 'wallets') {
                this[prop] = accountInfo[prop].map((el) => new Wallet(el));
            } else if (prop === 'lw_balance') {
                this[prop] = accountInfo[prop] / 100;
            } else {
                this[prop] = accountInfo[prop];
            }
        }

        this._isReadonly = this.isReadonly();
        this._isCompany = this.isCompany();
        this._isAdmin = this.isAdmin();
    }

    public isCompany() {
        return this && this.type === 'COMPANY';
    }

    public isAdmin() {
        return this.roles ? this.roles.indexOf(User.ROLE_ADMIN) !== -1 : false;
    }

    public isReadonly() {
        return this.roles ? this.roles.indexOf(User.ROLE_READONLY) !== -1 : false;
    }

    public getBalance(currency: string) {
        const currencyUpper = currency.toUpperCase();
        const balance = this.wallets && this.wallets.length
            ? (this.wallets.find((el) => el.currency === currencyUpper) || { available: 0 }).available
            : 0;
        return balance / 1e8;
    }
}
