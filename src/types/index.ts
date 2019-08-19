export type RecLang = 'es' | 'ca' | 'en';

export const REC_LANGS: { [key: string]: RecLang } = {
    CA: 'ca',
    EN: 'en',
    ES: 'es',
};

export type CrudRole = 'user' | 'admin' | 'self' | 'super_admin' | 'manager';

