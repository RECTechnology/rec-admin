export type RecLang = 'es' | 'ca' | 'en' | 'all';

export const REC_LANGS: { [key: string]: RecLang } = {
    ALL: 'all',
    CA: 'ca',
    EN: 'en',
    ES: 'es',
};

export type CrudRole = 'user' | 'admin' | 'self' | 'super_admin' | 'manager';
