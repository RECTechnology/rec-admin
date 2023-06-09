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
    { key: 'Cuenta id', value: '$.id', active: true },
    { key: 'Cuenta propietario', value: '$.kyc_manager.id', active: true },
    { key: 'Cuenta created', value: '$.created', active: true },
    { key: 'Cuenta company_name', value: '$.name', active: true },
    { key: 'Cuenta cif', value: '$.cif', active: true },
    { key: 'Cuenta type', value: '$.type', active: true },
    { key: 'Cuenta subtype', value: '$.subtype', active: true },
    { key: 'Cuenta barrio id', value: '$.neighbourhood.id', active: true },
    { key: 'Cuenta barrio', value: '$.neighbourhood.name', active: true },
    { key: 'Cuenta street_type', value: '$.street_type', active: true },
    { key: 'Cuenta street', value: '$.street', active: true },
    { key: 'Cuenta address_number', value: '$.address_number', active: true },
    { key: 'Cuenta zip', value: '$.zip', active: true },
    { key: 'Cuenta phone', value: '$.phone', active: true },
    { key: 'Cuenta email', value: '$.email', active: true },
    { key: 'Cuenta web', value: '$.web', active: true },
    { key: 'Cuenta saldo', value: '$.wallets[0].available', active: true },
    { key: 'Cuenta activities', value: '$.activities[*].name_es', active: true },
    { key: 'Cuenta activity_main_name', value: '$.activity_main.name_es', active: true },
    { key: 'Cuenta activity_main_id', value: '$.activity_main.id', active: true },
    { key: 'Usuario nombre', value: '$.kyc_manager.name', active: true },
    { key: 'Usuario apellidos', value: '$.kyc_manager.kyc_validations.last_name', active: true },
    { key: 'Usuario phone', value: '$.kyc_manager.phone', active: true },
    { key: 'Usuario sexo', value: '$.kyc_manager.kyc_validations.gender', active: true },
    { key: 'Usuario nacimiento', value: '$.kyc_manager.kyc_validations.date_birth', active: true },
    { key: 'Usuario codigo postal', value: '$.kyc_manager.kyc_validations.zip', active: true },
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

export const AccountChallengesExportDefaults: KvpItem[] = [
    { key: 'challenge-id', value: '$.challenge.id', active: true },
    { key: 'challenge-title', value: '$.challenge.title', active: true },
    { key: 'challenge-start-date', value: '$.challenge.start_date', active: true },
    { key: 'user-id', value: '$.account.kyc_manager.id', active: true },
    { key: 'gender', value: '$.account.kyc_manager.gender', active: true },
    { key: 'phone', value: '$.account.kyc_manager.phone', active: true },
    { key: 'account-id', value: '$.account.id', active: true },
    { key: 'account-name', value: '$.account.name', active: true },
    { key: 'account-cif', value: '$.account.cif', active: true },
    { key: 'account-type', value: '$.account.type', active: true },
    { key: 'account-subtype', value: '$.account.subtype', active: true },
    { key: 'account-neighborhood', value: '$.account.neighborhood', active: true },
    { key: 'challenge-completed', value: '$.created', active: true },
];
