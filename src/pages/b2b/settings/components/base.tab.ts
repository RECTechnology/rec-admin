import { MatDialog, Sort } from '@angular/material';
import { ConfirmationMessage } from 'src/components/dialogs/confirmation-message/confirmation.dia';

export abstract class EntityTabBase {
    public query: string = '';
    public limit = 10;
    public offset = 0;
    public total = 0;
    public sortDir = 'desc';
    public sortID = 'id';
    public loading = false;

    public data: any[] = [];
    public sortedData: any[] = [];

    constructor(public dialog: MatDialog) { }
    public abstract search(): any;

    public ngOnInit() {
        this.search();
    }

    public confirm(title, message, btnText = 'Delete') {
        const dialogRef = this.dialog.open(ConfirmationMessage);
        dialogRef.componentInstance.status = 'error';
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.btnConfirmText = btnText;

        return dialogRef.afterClosed();
    }

    public sortData(sort: Sort): void {
        if (!sort.active || sort.direction === '') {
            this.sortedData = this.data.slice();
            this.sortID = 'id';
            this.sortDir = 'desc';
        } else {
            this.sortID = sort.active;
            this.sortDir = sort.direction;
        }
        this.search();
    }

}
