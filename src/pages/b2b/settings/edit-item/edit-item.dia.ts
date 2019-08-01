import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
    selector: 'edit-item',
    templateUrl: './edit-item.dia.html',
})
export class EditItemDia {
    public title: string = 'EDIT_ITEM';
    public itemType: string = 'Item';
    public error: string;
    public loading: boolean;

    public item: any = {};

    constructor(
        public dialogRef: MatDialogRef<EditItemDia>,
    ) {

    }

    public ngOnInit() {
        return;
    }

    public save() {
        this.dialogRef.close({ ...this.item });
    }

    public close(): void {
        this.dialogRef.close(false);
    }

}
