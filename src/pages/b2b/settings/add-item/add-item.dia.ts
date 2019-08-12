import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'add-item',
    styleUrls: ['./add-item.scss'],
    templateUrl: './add-item.dia.html',
})
export class AddItemDia {
    public title: string = 'ADD_ITEM';
    public itemType: string = 'Item';
    public error: string;
    public loading: boolean = false;
    public disabled: boolean = false;

    public isProduct = false;
    public isEdit = false;
    public activities = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
    ];

    public item: any = {
        activities_consumed: [],
        activities_produced: [],
        cat: '',
        eng: '',
        esp: '',
    };


    constructor(
        public dialogRef: MatDialogRef<AddItemDia>,
        public us: UserService,
        public translate: TranslateService,
    ) {

    }

    public addConsumed(act) {
        this.item.activities_consumed.push(act);
    }

    public addProduced(act) {
        this.item.activities_produced.push(act);
    }

    public deleteProduced(i) {
        this.item.activities_produced.splice(i, 1);
    }

    public deleteConsumed(i) {
        this.item.activities_consumed.splice(i, 1);
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

    public check() {
        if (!this.item.esp || !this.item.eng || !this.item.cat) {
            const field: string = [
                !this.item.esp ? 'ESP' : '',
                !this.item.eng ? 'ENG' : '',
                !this.item.cat ? 'CAT' : '',
            ].filter((x) => x !== '').shift();
            this.error = this.translate.instant('INPUT_REQUIRED', {
                field: field ? this.translate.instant(field) : '',
            });
            this.disabled = true;
        } else {
            this.error = '';
            this.disabled = false;
        }
    }
}
