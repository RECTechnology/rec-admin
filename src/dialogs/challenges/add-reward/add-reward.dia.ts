import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmptyValidators } from '../../../components/validators/EmptyValidators';
import { DatePipe } from '@angular/common';
import { UtilsService } from 'src/services/utils/utils.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { RewardsCrud } from '../../../services/crud/reward/reward.crud';

@Component({
  selector: 'add-reward',
  templateUrl: './add-reward.dia.html',
})
export class AddRewardsDia extends BaseDialog {
  public isEdit = false;
  public edited = true;
  public rewardCopy: any;
  public reward: any = {
    id: null,
    name: null,
    description: null,
    image: null,
    author_url: null,
    status: 'created'
  } 
  public formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, EmptyValidators.noWhitespaceValidator]),
    image: new FormControl('', [Validators.required, EmptyValidators.noWhitespaceValidator]),
    description: new FormControl('', [EmptyValidators.noWhitespaceValidator]),
    author_url: new FormControl('', [EmptyValidators.noWhitespaceValidator]),
  })
  public itemType = 'Reward';
  public validationErrors = [];
  public datepipe: DatePipe = new DatePipe('es');

  constructor(
    public dialogRef: MatDialogRef<AddRewardsDia>,
    public alerts: AlertsService,
    public crud: RewardsCrud
  ) {
    super();
  }

  public ngOnInit() {
    if(this.isEdit){
      this.formGroup.patchValue({
        'name': this.reward.name,
        'description': this.reward.description,
        'image': this.reward.image,
        'author_url': this.reward.author_url,
      })
      this.rewardCopy = Object.assign({}, this.reward);
    }
    if(this.isEdit){
      this.validation();
    }
  }

  public createReward( reward ) {
    this.crud.create(reward)
      .subscribe((resp) => {
        this.dialogRef.close({ ...this.reward });

      },
      (error) => {
        this.validationErrors = error.errors;
        this.alerts.showSnackbar(error.message)
        this.loading = false;
      })            
  }

  public editReward( rewardId, reward ) {
    this.crud.update(rewardId, reward)
      .subscribe((resp) => {  
        this.dialogRef.close({ ...this.reward });         
    },
    (error) => {
      this.validationErrors = error.errors;
      this.alerts.showSnackbar(error.message)
      this.loading = false;
    })
  }

  public add() {
    if(this.formGroup.invalid || !this.formGroup.dirty || !this.edited && this.isEdit){
        return;
    }
    let reward: any = { ...this.reward };
    let rewardId: number;
  
    this.reward.name = this.formGroup.get('name').value;
    this.reward.description = this.formGroup.get('description').value;
    this.reward.author_url = this.formGroup.get('author_url').value;
    this.reward.image = this.formGroup.get('image').value;
    if (this.isEdit) {
      reward = UtilsService.deepDiff({ ...this.reward }, this.rewardCopy);
      rewardId = this.reward.id;
    }
    
    this.isEdit ? this.editReward(rewardId, {...reward }) : this.createReward({ ...this.reward });
  }

  public validation(){
    const initialValue = {
      name: this.rewardCopy.name,
      description: this.rewardCopy.description,
      image: this.rewardCopy.image,
      author_url: this.rewardCopy.author_url,
    }
    this.formGroup.valueChanges
      .pipe(
        debounceTime(100)
      )
      .subscribe(resp => {
        this.edited = Object.keys(initialValue).some(key => resp[key] != 
          initialValue[key])
      })
  }

}