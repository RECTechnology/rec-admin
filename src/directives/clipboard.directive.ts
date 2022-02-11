import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MySnackBarSevice } from 'src/bases/snackbar-base';

@Directive({ selector: '[copy-clipboard]' })
export class CopyClipboardDirective {
    constructor(
        private snackbar: MySnackBarSevice,
    ){}

    @Input('copy-clipboard')
    public payload: string;

    @Output('copied')
    public copied: EventEmitter<string> = new EventEmitter<string>();

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent): void {

        event.preventDefault();
        if (!this.payload) {
            return;
        }

        const listener = (e: ClipboardEvent) => {
            const clipboard = e.clipboardData || (window as any).clipboardData;
            clipboard.setData('text', this.payload.toString());
            e.preventDefault();

            this.copied.emit(this.payload);
            this.snackbar.open('Copied text');
        };

        document.addEventListener('copy', listener, false);
        document.execCommand('copy');
        document.removeEventListener('copy', listener, false);
    }
}
