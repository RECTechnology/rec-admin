import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MySnackBarSevice } from '../../../bases/snackbar-base';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { B2bService } from 'src/services/b2b/b2b.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'b2b-module',
  templateUrl: './tab_b2b.html',
})
export class B2BModuleTab {
  public providers = [
    {
      description: 'Empresa A, Empresa B, Empresa C',
      name: 'Insumo 1',
    },
    {
      description: 'Empresa A, Empresa B, Empresa C',
      name: 'Insumo 2',
    },
    {
      description: null,
      name: 'Insumo 3',
    },
  ];

  public clients = [
    {
      description: 'Pan, Bollos, etc...',
      name: 'Producto 1',
    },
    {
      description: 'Pan, Bollos, etc...',
      name: 'Producto 2',
    },
    {
      description: null,
      name: 'Producto 3',
    },
  ];

  @Input() public id = '';
  @Input() public pdfHtml = '';

  constructor(
    public b2bCrud: B2bService,
    public snackbar: MySnackBarSevice,
    public crudAccounts: AccountsCrud,
    public utils: UtilsService,
    public cs: CompanyService,
    private changeDetector: ChangeDetectorRef,
  ) {

  }

  public ngAfterContentInit() {
    this.crudAccounts.getPdfAsHtml(this.id)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.pdfHtml = resp;
          this.changeDetector.detectChanges();
        }, (error) => {
          console.log(error);
        },
      );
  }

  public sendB2b() {
    this.crudAccounts.getPdf(this.id)
      .subscribe(
        (resp) => {
          let date = new Date().toLocaleDateString().replace(/ /g, '-');
          let name = `${this.cs.selectedCompany.name}-report-${date}.pdf`
          this.utils.downloadBlob(resp, name);
        }, (error) => {
          console.log(error);
        },
      );
  }
}
