import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersTab {
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

  public deleteOffer(offerId) {

    this.loading = true;

    this.accountsCrud.deleteOffer(this.account.id, offerId).subscribe((resp) => {

      this.loading = false;
    });

  }

 
  public addOffer(){
    this.alerts.openModal(EditOfferDia, {
      item: Object.assign({}, ),
    }).subscribe((updated) => {
      if (updated) {
        var date = new Date(updated.end);
        var formattedDate = date.toISOString();
        this.loading = true;
        this.offersCrud.addOffer( this.account.id,{
          active : updated.active,
          description : updated.description,
          image: updated.image,
          type: updated.type,
          initial_price: updated.initial_price,
          end : formattedDate,
          offer_price: updated.offer_price,
        }).subscribe(
          (resp) => {
            this.relationOffer(resp.data.id)
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

  public relationOffer(id){
    this.accountsCrud.relacionOfferWhitAccount( this.account.id,{
      id: id
    }).subscribe(
      (resp) => {
        this.alerts.showSnackbar('Created offer');
        this.loading = false;
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
    
      var date = new Date(updated.end);
      var formattedDate = date.toISOString();
       
        
     
      if (updated) {
        this.loading = true;
        this.offersCrud.editOffer(offer.id, {
          active : updated.active,
          description : updated.description,
          image: updated.image,
          type: updated.type,
          initial_price: updated.initial_price,
          end : formattedDate,
          offer_price: updated.offer_price,
  
        }).subscribe(
          (resp) => {
            this.alerts.showSnackbar('Updated Offer: ' + offer.id, 'ok');
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

}
