import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
    selector: 'add-item',
    templateUrl: './add-item.dia.html',
})
export class AddItemDia {
    public title: string = 'ADD_ITEM';
    public itemType: string = 'Item';
    public error: string;
    public loading: boolean;

    public item: any = {
        cat: '',
        eng: '',
        esp: '',
    };

    constructor(
        public dialogRef: MatDialogRef<AddItemDia>,
    ) {

    }

    public ngOnInit() {
        return;
    }

    public add() {
        this.dialogRef.close({ ...this.item });
    }

    public close(): void {
        this.dialogRef.close(false);
    }
}
