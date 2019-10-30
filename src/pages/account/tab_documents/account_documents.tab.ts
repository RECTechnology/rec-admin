import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../../../services/wallet/wallet.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { environment } from '../../../environments/environment';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { FileUpload } from '../../../components/dialogs/file-upload/file-upload.dia';
import { AdminService } from '../../../services/admin/admin.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';

@Component({
  selector: 'documents-tab',
  styleUrls: ['./account_documents.tab.css'],
  templateUrl: './account_documents.tab.html',
})
export class AccountDocuments implements OnDestroy, OnInit {
  public loading = false;
  public account_id = null;
  public owner = null;
  public Brand: any = environment.Brand;
  public address = '';
  public type = '';
  public alreadyValidated = false;
  public lemonId = null;
  public documents = [
    {
      uploaded: false,
      // tslint:disable-next-line: object-literal-sort-keys
      status: 'not-uploaded',
      preview: null,
      name: 'EMPRESA_DNI_DELANTE',
      tag: 'document_front',
    },
    {
      uploaded: false,
      // tslint:disable-next-line: object-literal-sort-keys
      status: 'not-uploaded',
      preview: null,
      name: 'EMPRESA_DNI_DETRAS',
      tag: 'document_rear',
    },
    {
      uploaded: false,
      // tslint:disable-next-line: object-literal-sort-keys
      status: 'not-uploaded',
      preview: null,
      name: 'EMPRESA_RECIVO_BANCO',
      tag: 'banco',
    },
    {
      uploaded: false,
      // tslint:disable-next-line: object-literal-sort-keys
      status: 'not-uploaded',
      preview: null,
      name: 'EMPRESA_CIF',
      tag: 'cif',
    },
    {
      uploaded: false,
      // tslint:disable-next-line: object-literal-sort-keys
      status: 'not-uploaded',
      preview: null,
      name: 'EMPRESA_MODELO_200',
      tag: 'modelo200_o_titularidad',
    },
    {
      uploaded: false,
      // tslint:disable-next-line: object-literal-sort-keys
      status: 'not-uploaded',
      preview: null,
      name: 'EMPRESA_ESTATUTOS_ESCR',
      tag: 'estatutos',
    },
  ];
  public documentsAutomono = [
    {
      uploaded: false,
      // tslint:disable-next-line: object-literal-sort-keys
      status: 'not-uploaded',
      preview: null,
      name: 'AUTONOMO_DNI_DELANTE',
      tag: 'document_front',
    },
    {
      uploaded: false,
      // tslint:disable-next-line: object-literal-sort-keys
      status: 'not-uploaded',
      preview: null,
      name: 'AUTONOMO_DNI_DETRAS',
      tag: 'document_rear',
    },
    {
      uploaded: false,
      // tslint:disable-next-line: object-literal-sort-keys
      status: 'not-uploaded',
      preview: null,
      name: 'AUTONOMO_RECIVO_BANCO',
      tag: 'banco',
    },
    {
      uploaded: false,
      // tslint:disable-next-line: object-literal-sort-keys
      status: 'not-uploaded',
      preview: null,
      name: 'AUTONOMO_ALTA',
      tag: 'autonomo',
    },
    {
      uploaded: false,
      // tslint:disable-next-line: object-literal-sort-keys
      status: 'not-uploaded',
      preview: null,
      name: 'AUTONOMO_MODELO_036',
      tag: 'modelo03x',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public controles: ControlesService,
    public ws: WalletService,
    public companyService: CompanyService,
    public adminService: AdminService,
    public utils: UtilsService,
    public alerts: AlertsService,
    public crudAccounts: AccountsCrud,
  ) { }

  public ngOnInit() {
    this.route.params
      .subscribe((params) => {
        this.account_id = params.id;
        this.setUp();
      });
  }

  public setUp() {
    this.loading = true;
    this.crudAccounts.find(this.account_id)
      .subscribe((resp) => {
        this.companyService.selectedCompany = resp.data;
        this.controles.showAccountDetails = true;
        this.address = this.utils.constructAddressString(this.companyService.selectedCompany);
        this.owner = this.companyService.selectedCompany.kyc_manager.id;
        this.type = this.companyService.selectedCompany.type;
        this.lemonId = this.companyService.selectedCompany.lemon_id;
        this.alreadyValidated = !!this.lemonId;
        this.loading = false;

        this.getDocuments();
      }, (error) => {
        this.loading = false;
      });

  }

  public getDocuments() {
    this.adminService.getDocuments(this.owner)
      .subscribe((resp) => {
        for (const doc of resp.data.files) {
          // tslint:disable-next-line: forin
          for (const i in this.documents) {
            const d = this.documents[i];
            if (d.tag === doc.tag) {
              d.uploaded = true;
              d.status = doc.status;
              d.preview = doc.url;
            }
          }

          // tslint:disable-next-line: forin
          for (const i in this.documentsAutomono) {
            const d = this.documentsAutomono[i];
            if (d.tag === doc.tag) {
              d.uploaded = true;
              d.status = doc.status;
              d.preview = doc.url;
            }
          }
        }

        if (!resp.data.files.length) {
          // tslint:disable-next-line: forin
          for (const i in this.documentsAutomono) {
            const d = this.documentsAutomono[i];
            d.uploaded = false;
            d.status = 'not-uploaded';
            d.preview = '';
          }

          // tslint:disable-next-line: forin
          for (const i in this.documents) {
            const d = this.documents[i];
            d.uploaded = false;
            d.status = 'not-uploaded';
            d.preview = '';
          }
        }
      }, (error) => {
      });
  }

  public validateDocs(type) {
    let company = 0;
    let autonomo = 0;
    if (type === 'company') { company = 1; }
    if (type === 'autonomo') { autonomo = 1; }
    this.adminService.checkLemonKyc(autonomo, company, 0, this.owner)
      .subscribe((resp) => {
        this.alerts.showSnackbar('Documents validated', 'OK');
      }, (error) => {
        this.alerts.showSnackbar('Error: ' + error.message, 'OK');
      });
  }

  public openAccount(type) {
    let company = 0;
    let autonomo = 0;
    if (type === 'company') { company = 1; }
    if (type === 'autonomo') { autonomo = 1; }

    this.adminService.checkLemonKyc(autonomo, company, 1, this.owner)
      .subscribe((resp) => {
        this.adminService.uploadLemonFiles(autonomo, company, 1, this.owner)
          .subscribe(() => {
            this.alerts.showSnackbar('Account opened correctly', 'OK');
            this.setUp();
          }, (error) => {
            this.alerts.showSnackbar('Error: ' + error.message, 'OK');
          });

      }, (error) => {
        this.alerts.showSnackbar('Error: ' + error.message, 'OK');
      });
  }

  public saveDoc(url, tag) {
    return this.adminService.uploadDoc(url, tag, this.owner);
  }

  public selectDoc(doc, i) {
    this.uploadFile(doc.url)
      .subscribe((resp) => {
        if (resp) {
          this.saveDoc(resp, doc.tag)
            .subscribe(() => {
              this.alerts.showSnackbar('Uploaded document correctly!', 'OK');
              this.getDocuments();
            }, (error) => {
              this.alerts.showSnackbar('There has been an error: ' + error.message, 'OK');
            });
        }
      });
  }

  public removeDoc(doc, i) {
    return this.adminService.removeDoc(doc.tag, this.owner)
      .subscribe((resp) => {
        this.alerts.showSnackbar('Removed document', 'OK');
        this.setUp();
      }, (error) => {
        this.alerts.showSnackbar('Error: ' + error.message, 'OK');
      });
  }

  public ngOnDestroy() {
    this.companyService.selectedCompany = null;
    this.controles.showAccountDetails = false;
  }

  private uploadFile(url) {
    return this.alerts.openModal(FileUpload, {
      hasSelectedImage: !!url,
      selectedImage: url,
    });
  }
}
