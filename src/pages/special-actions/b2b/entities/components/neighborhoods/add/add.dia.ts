import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { EmptyValidators } from '../../../../../../../components/validators/EmptyValidators';

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
    public edited = false;

    public item: any = {
        description: '',
        name: '',
    };
    public itemCopy: any;

    public formGroup = new FormGroup({
        name: new FormControl("",[Validators.required, EmptyValidators.noWhitespaceValidator]),
        description: new FormControl()
    })

    constructor(
        public dialogRef: MatDialogRef<AddNeighbourhoodDia>,
        public us: UserService,
        public translate: TranslateService,
    ) {}


    public ngOnInit() {
        this.formGroup.get('name').setValue(this.item.name);
        this.formGroup.get('description').setValue(this.item.description);
        this.validation();
    }

    public validation(){
        this.itemCopy = {
          name: this.item.name,
          description: this.item.description
        }
        const initialValue = this.itemCopy;
        this.formGroup.valueChanges
          .pipe(
            debounceTime(100)
          )
          .subscribe(resp => {
            this.edited = Object.keys(initialValue).some(key => this.formGroup.value[key] != 
              initialValue[key])
          })
      }

    public add() {
        if( this.formGroup.invalid || this.loading || this.disabled || !this.formGroup.dirty || this.edited == false ){
            return;
        }
        this.item.name = this.formGroup.get('name').value; 
        this.item.description = this.formGroup.get('description').value; 
        this.dialogRef.close({ ...this.item });
    }

    public close(): void {
        this.dialogRef.close(false);
    }
}
