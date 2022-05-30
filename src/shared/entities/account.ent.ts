import { Schedule } from './schedule/Schedule.ent';
import { User } from './user.ent';
import { Wallet } from './wallet.ent';
import { Activity } from './translatable/activity.ent';
import { Product } from './translatable/product.ent';
import { Tier } from './tier.ent';
import { Pos } from './pos.ent';
import { Campaign } from './campaign.ent';
import { Badge } from './badge.ent';

export type AccountType = 'PRIVATE' | 'COMPANY';
export type AccountSubtype = 'RETAILER' | 'WHOLESALE' | 'NORMAL' | 'BMINCOME' | 'INFANCIA21';

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
  campaigns: Campaign[];
  badges: Badge[];
  activityMain: any;
  subActivity: any;
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

  pos?: Pos;

  id: number;
  latitude: number;
  lemon_id: string;
  level_id: number | string;
  level: Tier;
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
  producing_products: Product[];
  secondaryActivities: any[];
  public_image: string;
  rec_address: string;
  rezero_b2b_username: string;
  roles: string[];
  schedule: Schedule | string;
  scheduleString: string;
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
  public static SUBTYPE_COMPANY_INFANCIA21: AccountSubtype = 'INFANCIA21';

  public static ACCOUNT_TYPES = [Account.TYPE_COMPANY, Account.TYPE_PRIVATE];
  public static ACCOUNT_SUB_TYPES_PRIVATE = [
    Account.SUBTYPE_COMPANY_NORMAL,
    Account.SUBTYPE_COMPANY_BMINCOME,
    Account.SUBTYPE_COMPANY_INFANCIA21,
  ];
  public static ACCOUNT_SUB_TYPES_COMPANY = [Account.SUBTYPE_COMPANY_WHOLESALE, Account.SUBTYPE_COMPANY_RETAILER];

  constructor(accountInfo?: Account) {
    for (const prop in accountInfo) {
      try {
        if (prop === 'wallets') {
          this[prop] = accountInfo[prop].map((el) => new Wallet(el));
        } else if (prop === 'campaigns') {
          this[prop] = accountInfo[prop].map((el) => new Campaign(el));
        } else if (prop === 'lw_balance') {
          this[prop] = accountInfo[prop] / 100;
        } else if (prop === 'level') {
          this[prop] = new Tier(accountInfo[prop]);
          this.level_id = this[prop].id;
        }else if (prop === 'schedule') {
          this[prop] = Schedule.fromJsonString(accountInfo[prop]);
          this['scheduleString'] = accountInfo[prop] as string;
        } else {
          this[prop] = accountInfo[prop];
        }
      } catch (e) {
        console.error(e);
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

  public getBalance(currency: string, defaultReturn = 0) {
    const currencyUpper = currency.toUpperCase();
    const balance =
      this.wallets && this.wallets.length
        ? (this.wallets.find((el) => el.currency === currencyUpper) || { available: 0 }).available
        : 0;
    return balance / 1e8 || defaultReturn;
  }

  public isCampaignActive(campaign: Campaign): boolean {
    const hasCampaigns = this.campaigns && this.campaigns.length;
    return hasCampaigns && !!this.campaigns.find((c) => campaign.id === c.id);
  }
}
