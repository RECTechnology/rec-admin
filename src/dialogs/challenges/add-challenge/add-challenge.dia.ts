import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmptyValidators } from '../../../components/validators/EmptyValidators';
import { DatePipe } from '@angular/common';
import { Challenge } from '../../../shared/entities/challenge.ent';
import { RewardsCrud } from 'src/services/crud/reward/reward.crud';
import { UtilsService } from 'src/services/utils/utils.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { ChallengeCrud } from 'src/services/crud/challenges/challenges.crud';
import { environment } from '../../../environments/environment';
import { Badge } from '../../../shared/entities/badge.ent';

@Component({
  selector: 'add-challenge',
  templateUrl: './add-challenge.html',
  styleUrls: ['./add-challenge.scss'],
})
export class AddChallengeDia extends BaseDialog {
  public isEdit = false;
  public edited = true;
  public isBuy = false;
  public isSend = false;
  public start_date: string;
  public finish_date: string;
  public disabledEndDate = false;
  public disabledSelectors = false;
  public badgeLabel: string = 'Any';
  public challengeType = 'challenge';
  public challengeStatus = 'scheduled';
  public isSpend = false;
  public actionId: number;
  public data: any = null;
  public rewards: any = null;
  public rewardsFiltered: any = null;
  public challengeCopy: Challenge;
  public challenge: Challenge = {
    id: null,
    activities: null,
    title: null,
    description: null,
    action: null,
    type: null,
    threshold: null,
    amount_required: null,
    cover_image: null,
    owner_id: null,
    token_reward: null,
    status: null,
    start_date: null,
    finish_date: null,
    badges: null,
  }
  public types = [
    {label: 'Gasta X RECs', action: 'buy', id: 1},
    {label: 'Realiza X compras', action: 'buy', id: 2},
    {label: 'Envía X RECs', action: 'send', id: 3}
  ];

  public formGroup = new FormGroup({
    cover_image: new FormControl('', [Validators.required, EmptyValidators.noWhitespaceValidator]),
    title: new FormControl('', [Validators.required, EmptyValidators.noWhitespaceValidator, Validators.maxLength(60)]),
    description: new FormControl('', [Validators.required, EmptyValidators.noWhitespaceValidator]),
    start_date: new FormControl('', [Validators.required]),
    finish_date: new FormControl('', [Validators.required]),
    threshold: new FormControl(0, [Validators.required]),
    action: new FormControl('', Validators.required),
    badge: new FormControl(''),
    amount_required: new FormControl(0, [Validators.required, Validators.min(0.1)]),
    token_reward: new FormControl('', Validators.required)
  })
  public itemType = 'Challenge';
  public validationErrors = [];
  public datepipe: DatePipe = new DatePipe('es');

  constructor(
    public dialogRef: MatDialogRef<AddChallengeDia>,
    public alerts: AlertsService,
    public rewardsCrud: RewardsCrud,
    public challengeCrud: ChallengeCrud,
  ) {
    super();
    dialogRef.disableClose = true;
  }

  public ngOnInit() {
    this.getRewards();
    this.setInitialAction();
    this.openChallenge();
    
    if(this.isEdit){
      this.formGroup.patchValue({
        'cover_image': this.challenge.cover_image,
        'title': this.challenge.title,
        'description': this.challenge.description,
        'start_date': this.formatDate(this.challenge.start_date),
        'finish_date': this.formatDate(this.challenge.finish_date),
        'threshold': this.challenge.threshold ?? 0,
        'action': this.actionId,
        'amount_required': this.convertToRecs(this.challenge.amount_required) ?? 0,
        'token_reward': this.challenge.token_reward,
        'badge': this.challenge.badges[0] 
      })
      this.challengeCopy = Object.assign({}, this.challenge);
      if(this.formGroup.get('badge').value) {
        this.badgeLabel = '';
      }else {
        this.badgeLabel = 'Any';
      }
      this.validation();
    }
  }

  public getRewards(query?: string) {
    this.loading = true;
    this.rewardsCrud
        .search({
            order: 'desc',
            limit: 50,
            offset: 0,
            sort: 'status'
        },'all')
        .subscribe(
            (resp) => {
                this.data = resp.data.elements;
                this.rewards = this.data.slice();
                this.filterRewards(this.rewards);
                this.loading = false;
              },
              (error) => {
                this.validationErrors = error.errors;
                this.loading = false;
              },
        );
  }

  public formatDate(date: string){
    var datepipe: DatePipe = new DatePipe('es');
    var dateItem = new Date(date);
    return datepipe.transform(dateItem, 'yyyy-MM-ddTHH:mm:ss');
  }

  public openChallenge() {
      if(this.challenge.status === 'open' && this.isEdit) {
        this.formGroup.disable();
        this.formGroup.get('finish_date').enable(); 
        this.disabledSelectors = true;
        this.alerts.showSnackbar('OPEN_CHALLENGE_ADVISE', 'ok')
      }
  }

  public changeLabel($event) {
    if($event) {
      this.badgeLabel = '';
    }else {
      this.badgeLabel = 'Any';
    }
  }

  public convertToSatoshis( amount ){
    return amount * 10e7;
  }

  public convertToRecs( amount ) {
    return amount / 10e7;
  }

  public validation(){
    var datepipe: DatePipe = new DatePipe('es');
    this.challengeCopy.start_date = datepipe.transform(this.challengeCopy.start_date, 'yyyy-MM-ddTHH:mm:ss');
    this.challengeCopy.finish_date = datepipe.transform(this.challengeCopy.finish_date, 'yyyy-MM-ddTHH:mm:ss');
    const initialValue = {
      title: this.challengeCopy.title,
      description: this.challengeCopy.description,
      cover_image: this.challengeCopy.cover_image,
      start_date: this.challengeCopy.start_date,
      finish_date: this.challengeCopy.finish_date,
      threshold: this.challenge.threshold,
      action: this.challengeCopy.action,
      amount_required: this.convertToRecs(this.challengeCopy.amount_required),
      token_reward: this.challengeCopy.token_reward,
      badges: this.challengeCopy.badges 
    }
    this.formGroup.valueChanges
      .pipe(
        debounceTime(100)
      )
      .subscribe(resp => {
        var datepipe: DatePipe = new DatePipe('es');
        resp.start_date = datepipe.transform(resp.start_date, 'yyyy-MM-ddTHH:mm:ss')
        resp.finish_date = datepipe.transform(resp.finish_date, 'yyyy-MM-ddTHH:mm:ss')
        this.edited = Object.keys(initialValue).some(key => resp[key] != 
          initialValue[key]);  
      })
  }

  public setActionId(){
    if(this.challenge.action === 'buy' && this.challenge.threshold !== 0){
      this.actionId = 2;
    }else if(this.challenge.action === 'buy' && this.challenge.threshold === 0){
      this.actionId = 1;
    }else if(this.challenge.action === 'send'){
      this.actionId = 3;
    }
  }

  public getActionFromId(id){
    let action = '';
    this.types.map(type => {
      if(type.id === Number(id)) action = type.action;
    })
    return action;
  }

  public changeStartDate(event) {
    var dateSupport: Date = new Date(event.target.value);
    var datepipe: DatePipe = new DatePipe('es');
    this.formGroup.get('start_date').setValue(datepipe.transform(dateSupport, 'yyyy-MM-ddTHH:mm:ss'));
    this.start_date = dateSupport.toISOString();
  }

  public changeFinishDate(event) {
    var dateSupport: Date = new Date(event.target.value);
    var datepipe: DatePipe = new DatePipe('es');
    this.formGroup.get('finish_date').setValue(datepipe.transform(dateSupport, 'yyyy-MM-ddTHH:mm:ss'));
    this.finish_date = dateSupport.toISOString();
  }

  public filterRewards(rewards){
    this.rewardsFiltered = rewards.filter( reward => !reward.hasOwnProperty('challenge'));
    return this.rewardsFiltered;
  }

  public actionChanged($event){
    if($event.value === 2){
      this.formGroup.get('amount_required').setValue(0);
      this.formGroup.get('amount_required').setErrors(null);
      this.isBuy = true;
      this.isSend = false;
      this.isSpend = false;
    }
    if($event.value === 3){
      this.formGroup.get('threshold').setValue(0);
      this.formGroup.get('threshold').setErrors(null);
      this.isBuy = false;
      this.isSend = true;
      this.isSpend = false;
    }
    if($event.value === 1){
      this.formGroup.get('threshold').setValue(0);
      this.formGroup.get('threshold').setErrors(null);
      this.isBuy = false;
      this.isSend = false;
      this.isSpend = true;
    }
  }

  public setInitialAction() {
    this.setActionId();
    if(this.challenge.action === 'buy' && this.challenge.threshold !== 0){
        this.formGroup.get('amount_required').setValue(0);
        this.formGroup.get('amount_required').setErrors(null);
        this.isBuy = true;
        this.isSend = false;
        this.isSpend = false;

    }else if(this.challenge.action === 'send'){
        this.formGroup.get('threshold').setValue(0);
        this.formGroup.get('threshold').setErrors(null);
        this.isBuy = false;
        this.isSend = true;
        this.isSpend = false;

    }else if(this.challenge.action === 'buy' && this.challenge.threshold === 0) {
        this.formGroup.get('threshold').setValue(0);
        this.formGroup.get('threshold').setErrors(null);
        this.isBuy = false;
        this.isSend = false;
        this.isSpend = true;
    }
  }

  public editBadge( challengeId ){
    this.challengeCrud.deleteBadge(String(challengeId), String(this.challenge.badges[0].id))
      .subscribe(resp => {
        if(this.formGroup.get('badge').value){
          this.challengeCrud.addBadge(this.formGroup.get('badge').value, String(challengeId))
          .subscribe(resp => {
            this.dialogRef.close({ ...this.challenge });
            this.loading = false;
          },
          (error => {
            this.alerts.showSnackbar(error.message);
            this.loading = false;
          })
          )
        }else {
          this.dialogRef.close({ ...this.challenge });
        }
      },
      (error => {
        this.alerts.showSnackbar(error.message);
        this.dialogRef.close({ ...this.challenge });
      }
    ));
  }

  public addBadge( badge: Badge, id: string ) {
    if(badge) {
      this.challengeCrud.addBadge(badge, String(id))
      .subscribe(resp => {
        this.dialogRef.close({ ...this.challenge });
      },
      (error => {
        this.alerts.showSnackbar(error.message);
        this.dialogRef.close({ ...this.challenge });
        this.loading = false;
      })
    )
    }else {
      this.dialogRef.close({ ...this.challenge });
    }
  }              
  
  public addItem( challenge ) {
    if (challenge) {
           
    this.loading = true;

    this.challengeCrud.create(challenge)
      .subscribe((resp) => {
        if(resp){
           this.addBadge( this.formGroup.get('badge').value, resp.data.id );
        }
      },
      (error) => {
        if(error){
        if(error.errors){
          this.validationErrors = error.errors;
        }
        this.alerts.showSnackbar(error.message)
        this.loading = false;
        }
        this.loading = false;
      }) 
    }
  }

  public editItem( challengeId ,challengeItem ) {

    if (challengeItem) {    
    this.loading = true;

    this.challengeCrud.update(challengeId, challengeItem)
      .subscribe((resp) => {
        if(resp && this.challenge.badges && this.challenge.badges.length > 0){
          this.editBadge(challengeId);
        }else {
          this.addBadge( this.formGroup.get('badge').value, String(challengeId) )
        }    
      },
      (error) => {
        if(error){
          if(error.errors){
            this.validationErrors = error.errors;
          }
          this.alerts.showSnackbar(error.message)
          this.loading = false;
        }
        this.loading = false;
      })     
    }
  }

  public add() {
    if(this.formGroup.invalid || !this.formGroup.dirty || !this.edited && this.isEdit){
        return;
    }
    let challenge: any = { ...this.challenge };
    let challengeId: number;

    this.challenge.cover_image = this.formGroup.get('cover_image').value;
    this.challenge.description = this.formGroup.get('description').value;
    this.challenge.title = this.formGroup.get('title').value;
    this.challenge.start_date = this.start_date;
    this.challenge.finish_date = this.finish_date;
    this.challenge.action = this.getActionFromId(this.formGroup.get('action').value);
    this.challenge.amount_required = this.convertToSatoshis(this.formGroup.get('amount_required').value);
    this.challenge.token_reward_id = this.formGroup.get('token_reward').value.id;
    this.challenge.threshold = this.formGroup.get('threshold').value;
    this.challenge.owner_id = environment.adminId;
    this.challenge.type = this.challengeType;
    this.challenge.status = this.challengeStatus;

    if (this.isEdit) {
      this.challenge.status = null;
      challenge = UtilsService.deepDiff({ ...this.challenge }, this.challengeCopy);
      challengeId = this.challenge.id;
    }
    
    this.isEdit ? this.editItem(challengeId, {...challenge}) : this.addItem({ ...this.challenge });
  }

  }
