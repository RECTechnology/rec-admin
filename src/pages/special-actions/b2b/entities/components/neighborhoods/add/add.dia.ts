import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    };

    public formGroup = new FormGroup({
        name: new FormControl("", Validators.required)
    })

    constructor(
        public dialogRef: MatDialogRef<AddNeighbourhoodDia>,
        public us: UserService,
        public translate: TranslateService,
    ) {}

    public ngOnInit() {
        return;
    }

    public add() {
        if( this.formGroup.invalid || this.loading || this.disabled ){
            return;
        }
        this.dialogRef.close({ ...this.item });
    }

    public close(): void {
        this.dialogRef.close(false);
    }
}
