import { Directive, ElementRef, Input } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';

@Directive({
    selector: '[collapsesWhen]',
})

export class CollapsableWhen {
    public collapsed = false;
    private handler = null;
    private namePrivate;

    @Input() set collapsesWhen(name) {
        this.namePrivate = name;
    }

    constructor(
        public controles: ControlesService,
        public elr: ElementRef,
    ) { }

    public ngOnInit() {
        if (!this.handler) {
            this.handler = this.controles.addHandler(this.namePrivate, this.toggle.bind(this));
        }
        this.collapsed = !this.controles.isToggled(this.namePrivate);
        this.toggleCollapsedClass();
    }

    public ngOnDestroy() {
        if (this.handler) {
            this.handler.remove();
        }
    }

    public toggle(toggled) {
        this.collapsed = !toggled;
        this.toggleCollapsedClass();
    }

    private toggleCollapsedClass(){
        if (this.collapsed) {
            this.elr.nativeElement.classList.add('collapsed');
        } else {
            this.elr.nativeElement.classList.remove('collapsed');
        }
    }
}
