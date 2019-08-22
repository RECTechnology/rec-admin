import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';

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

    public actQuery = '';

    public isProduct = false;
    public isEdit = false;
    public activities = [];

    public item: any = {
        consuming_by: [],
        producing_by: [],
        cat: '',
        eng: '',
        esp: '',
    };

    constructor(
        public dialogRef: MatDialogRef<AddItemDia>,
        public us: UserService,
        public translate: TranslateService,
        public activitiesCrud: ActivitiesCrud,
    ) {
        this.activitiesCrud.list({ offset: 0, limit: 100 })
            .subscribe((resp) => {
                console.log('activities', resp);
                this.activities = resp.data.elements;
            });
    }

    public addConsumed(act) {
        this.item.consuming_by.push(act);
    }

    public addProduced(act) {
        this.item.producing_by.push(act);
    }

    public deleteProduced(i) {
        this.item.producing_by.splice(i, 1);
    }

    public deleteConsumed(i) {
        this.item.consuming_by.splice(i, 1);
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

    public nameMatches(name: string) {
        return String(name).toLowerCase().includes(this.actQuery.toLowerCase());
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
