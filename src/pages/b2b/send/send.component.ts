import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';

@Component({
    selector: 'b2b-send',
    templateUrl: './send.html',
})
export class B2BSendComponent {
    constructor(
        public controles: ControlesService,
    ) { }
}
