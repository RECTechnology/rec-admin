import { Component } from '@angular/core';
import { CompanyService } from '../../../services/company/company.service';

@Component({
  selector: 'companies-tab',
  templateUrl: '../../../pages/profile/tab_companies/companies-tab.html',
})
export class CompaniesTab {
  constructor(
    private companyService: CompanyService,
  ) {
    this.companyService.doGetCompanies();
  }

  public selectCompany(company) {
    this.companyService.selectCompany(company, true)
      .subscribe(
        (resp) => resp,
      );
  }
}
