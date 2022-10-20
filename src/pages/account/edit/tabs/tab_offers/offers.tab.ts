import {  Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { EditOfferDia } from './editOffers/editOffers';
import { OffersCrud } from 'src/services/crud/offers/offers.crud';

@Component({
  selector: 'tab-offers',
  templateUrl: './offers.html',
  styleUrls: ['./offers.scss'],
})
export class OffersTab {
  static readonly tabName = 'offers';

  @Input() public id = '';
  @Input() public account: Account;
  @Output() public close: EventEmitter<any> = new EventEmitter();
  @Input() public loading: boolean = false;
  public pageName = 'Offers';
  public addedText = ' ...';
  @ViewChild('textDesc', { static: false }) public textDescElement: ElementRef;

  constructor(
    public accountsCrud: AccountsCrud,
    public offersCrud: OffersCrud,
    public snackbar: MySnackBarSevice,
    public alerts: AlertsService,
  ) { }

  ngOnInit(){
  }

  ngOnChange(){
    
  }

  public deleteOffer(offerId) {

    this.loading = true;
    this.alerts.showConfirmation('SURE_DELETE_OFFER',{}, 'DELETE_OFFER').subscribe((resp) => {
      if (resp) {

        this.offersCrud.deleteOffer( offerId).subscribe((resp) => {
          this.loading = false;
          this.alerts.showSnackbar('OFFER_DELETED', 'ok');
          this.getAllData();
        });
      }
    });
    


  }

 
  public addOffer(){
    this.alerts.openModal(EditOfferDia, {
      item: Object.assign({}, ),
      isEdit: false,
    }).subscribe((updated) => {
      if (updated != null ) {
        var date = new Date(updated.end);
        var formattedDate = date.toISOString();
        this.loading = true;
        this.offersCrud.addOffer( this.account.id,{
          active : updated.active,
          description : updated.description,
          image: updated.image,
          type: updated.type,
          initial_price: updated.initial_price,
          discount:updated.discount,

          end : formattedDate,
          offer_price: updated.offer_price,
        }).subscribe(
          (resp: any) => {
            this.relationOffer(resp.data.id);
            this.loading = false;
          },
          (error) => {
            this.alerts.showSnackbar(error.message);
            this.loading = false;
          },
        );
      }
    });
  }

 

  public getAllData(){
    this.accountsCrud.find(this.account.id).subscribe(
      (resp: any) => {

        this.account = resp.data;
        this.loading = false;
        
      },
      (error) => {
        this.loading = false;
        this.alerts.showSnackbar('ACCOUNT_NOT_FOUND');
        
      },);
  }


  public relationOffer(id){
    this.accountsCrud.relacionOfferWhitAccount( this.account.id,{
      id: id
    }).subscribe(
      (resp) => {
        this.alerts.showSnackbar('CREATED_OFFER');
        this.loading = false;
        this.getAllData();


      },
      (error) => {
        this.alerts.showSnackbar(error.message);
        this.loading = false;
      },
    );

  }

  ngOnChanges(){

  }

  public editOffer(offer) {
    this.alerts.openModal(EditOfferDia, {

      item: Object.assign({}, offer),

    }).subscribe((updated) => {
    
      if (updated) {
        this.loading = true;
        var date = new Date(updated.end);
        var formattedDate = date.toISOString();


        this.offersCrud.editOffer(offer.id, {
          active : updated.active,
          description : updated.description,
          image: updated.image,
          type: updated.type,
          discount: updated.discount,
          initial_price: updated.initial_price,
          end : formattedDate??null,

          offer_price: updated.offer_price,
  
        }).subscribe(
          (resp) => {
            this.alerts.showSnackbar('UPDATED_OFFER' , 'ok');
            this.loading = false;
            this.getAllData();


          },
          (error) => {
            this.alerts.showSnackbar(error.message);
            this.loading = false;
          },
        );
      }
    });
    

  }

}
