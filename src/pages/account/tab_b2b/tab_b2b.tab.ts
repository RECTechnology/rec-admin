import { Component, AfterContentInit, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../../../services/wallet/wallet.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { MySnackBarSevice } from '../../../bases/snackbar-base';
import { environment } from '../../../environments/environment';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { EditAccountData } from '../../dialogs/edit-account/edit-account.dia';
import { MatDialog } from '@angular/material';
import { FileUpload } from '../../../components/dialogs/file-upload/file-upload.dia';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
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
}
