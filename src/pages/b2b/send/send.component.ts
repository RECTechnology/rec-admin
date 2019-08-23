import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';
import { B2bService } from 'src/services/b2b/b2b.service';
import { MySnackBarSevice } from 'src/bases/snackbar-base';

@Component({
    selector: 'b2b-send',
    templateUrl: './send.html',
})
export class B2BSendComponent {
    constructor(
        public controles: ControlesService,
        public b2bCrud: B2bService,
        public snackbar: MySnackBarSevice,
    ) { }

    public sendMail() {
        this.b2bCrud.sendB2BMailBulk()
            .subscribe(
                (resp) => {
                    this.snackbar.open('Sent mail');
                }, (error) => {
                    this.snackbar.open(error.message);
                },
            );
    }
}
