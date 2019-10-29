import { Injectable } from '@angular/core';
import { REC_LANGS, RecLang } from './types';

@Injectable({
    providedIn: 'root',
})
export class NgxRecOptions {
    public base_url = 'https://api.rec.barcelona';
    public flags = {
        translateHeaders: false,
    };
    public headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
    };
    public lang = REC_LANGS.EN;
}

export interface NgxModuleOptions {
    lang?: RecLang;
    base_url?: string;

    client_secret: string;
    client_id: string;
}

export const DEFAULT_OPTS = {
    base_url: 'https://api.rec.barcelona',
    flags: {
        translateHeaders: false,
    },
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
    },
    lang: REC_LANGS.EN,
};
