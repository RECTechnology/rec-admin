import { AlertsService } from 'src/services/alerts/alerts.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../../../../../services/utils/utils.service';
import { CreateTXsBlockChange, NewDelegateChange } from '../create_txs_block_change/create_txs_block_change.dia';


@Component({
  selector: 'txs-block-header',
  styleUrls: ['./txs_block_header.css'],
  templateUrl: './txs_block_header.html',
})
export class TxsBlockHeaderComponent {
  public searchQuery: string = '';

  @Output('onNewChange') public onNewChange: EventEmitter<NewDelegateChange>;
  @Output('onImport') public onImport: EventEmitter<any>;

  constructor(public utils: UtilsService, private alerts: AlertsService) {
    this.onNewChange = new EventEmitter();
    this.onImport = new EventEmitter();
  }

  public showNewChange() {
    this.alerts.openModal(CreateTXsBlockChange).subscribe((data: NewDelegateChange) => {
      if (!data) return;
      this.onNewChange.emit(data);
    });
  }

  public newImport() {
    this.onImport.emit();
  }
}
