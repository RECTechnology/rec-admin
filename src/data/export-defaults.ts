import { KvpItem } from '../components/ui/kvp/kvp-list/kvp-list';

// tslint:disable-next-line: variable-name
export const UsersExportDefaults: KvpItem[] = [
    { key: 'id', value: '$.id', active: true },
    { key: 'username', value: '$.username', active: true },
    { key: 'email', value: '$.email', active: true },
    { key: 'enabled', value: '$.enabled', active: true },
    { key: 'locked', value: '$.locked', active: true },
    { key: 'expired', value: '$.expired', active: true },
    { key: 'roles', value: '$.roles[*]', active: true },
    { key: 'name', value: '$.name', active: true },
    { key: 'created', value: '$.created', active: true },
    { key: 'dni', value: '$.dni', active: true },
    { key: 'prefix', value: '$.prefix', active: true },
    { key: 'phone', value: '$.phone', active: true },
    { key: 'pin', value: '$.pin', active: true },
    { key: 'public_phone', value: '$.public_phone', active: true },
];

// tslint:disable-next-line: variable-name
export const AccountsExportDefaults: KvpItem[] = [
    { key: 'id', value: '$.id', active: true },
    { key: 'company_name', value: '$.name', active: true },
    { key: 'cif', value: '$.cif', active: true },
    { key: 'type', value: '$.type', active: true },
    { key: 'subtype', value: '$.subtype', active: true },
    { key: 'name', value: '$.kyc_manager.name', active: true },
    { key: 'lastname', value: '$.kyc_manager.kyc_validations.last_name', active: true },
    { key: 'street_type', value: '$.street_type', active: true },
    { key: 'street', value: '$.street', active: true },
    { key: 'address_number', value: '$.address_number', active: true },
    { key: 'dni', value: '$.kyc_manager.dni', active: true },
    { key: 'phone', value: '$.phone', active: true },
    { key: 'alias', value: '$.kyc_manager.active_card.alias', active: true },
    { key: 'amount', value: '$.wallets[0].available', active: true },
    { key: 'neighbourhood_id', value: '$.neighbourhood.id', active: true },
    { key: 'neighbourhood_name', value: '$.neighbourhood.name', active: true },
    { key: 'activities', value: '$.activities[*].name_es', active: true },
 { key: 'activity_main_name', value: '$.activity_main.name_es', active: true },
    { key: 'activity_main_id', value: '$.activity_main.id', active: true },
   
];

// tslint:disable-next-line: variable-name
export const OrgsExportDefaults: KvpItem[] = [
    { key: 'id', value: '$.id', active: true },
    { key: 'name', value: '$.name', active: true },
    { key: 'cif', value: '$.cif', active: true },
    { key: 'type', value: '$.type', active: true },
    { key: 'subtype', value: '$.subtype', active: true },
    { key: 'street_type', value: '$.street_type', active: true },
    { key: 'street', value: '$.street', active: true },
    { key: 'address_number', value: '$.address_number', active: true },
    { key: 'dni', value: '$.kyc_manager.dni', active: true },
    { key: 'phone', value: '$.phone', active: true },
];

export const QualificationExportDefaults: KvpItem[] = [
    { key: 'id', value: '$.id', active: true },
    { key: 'value', value: '$.value', active: true },
    { key: 'created', value: '$.created', active: true },
    { key: 'updated', value: '$.updated', active: true },
    { key: 'status', value: '$.status', active: true },
    { key: 'badge_id', value: '$.badge.id', active: true },
    { key: 'account_id', value: '$.account.id', active: true },
    { key: 'account_name', value: '$.account.name', active: true },
    { key: 'account_name_es', value: '$.account.name_es', active: true },
    { key: 'account_name_ca', value: '$.account.name_ca', active: true },
    { key: 'reviewer_name', value: '$.reviewer.name', active: true },
    { key: 'reviewer_name_es', value: '$.reviewer.name_es', active: true },
    { key: 'reviewer_name_ca', value: '$.reviewer.name_ca', active: true },
    { key: 'badge_name', value: '$.badge.name', active: true },
    { key: 'badge_name_es', value: '$.badge.name_es', active: true },
    { key: 'badge_name_ca', value: '$.badge.name_ca', active: true },
];
