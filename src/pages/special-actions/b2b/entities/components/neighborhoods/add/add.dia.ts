import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/services/user.service';

@Component({
    selector: 'add-neighborhoods',
    styleUrls: ['./add.scss'],
    templateUrl: './add.dia.html',
})
export class AddNeighbourhoodDia {
    public title: string = 'ADD_ITEM';
    public error: string;
    public loading: boolean = false;
    public disabled: boolean = false;
    public isEdit = false;

    public item: any = {
        description: '',
        name: '',
        townhall_code: '',
    };

    constructor(
        public dialogRef: MatDialogRef<AddNeighbourhoodDia>,
        public us: UserService,
        public translate: TranslateService,
    ) {
        this.check();
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
        if (!this.item.name) {
            this.error = this.translate.instant('INPUT_REQUIRED', {
                field: 'name',
            });
            this.disabled = true;
        } else {
            this.error = '';
            this.disabled = false;
        }
    }
}
