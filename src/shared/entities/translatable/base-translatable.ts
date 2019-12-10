
export interface TranslatableEntity {
    name?: string;
    [key: string]: any;
}
export class TranslatableEntity {
    public get(lang: string) {
        if (this.translations[lang]) {
            return this.translations[lang];
        } else {
            return this.name;
        }
    }
}