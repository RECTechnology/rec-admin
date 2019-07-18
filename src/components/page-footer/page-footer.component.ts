import { Component, OnInit } from '@angular/core';
import { ControlesService } from '../../services/controles/controles.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'page-footer',
  templateUrl: '../../components/page-footer/page-footer.html',
})
export class PageFooterComponent {
  public brand = environment.Brand;
  public env = environment;
  public year = (new Date()).getFullYear();
  constructor(
    private contrService: ControlesService,
  ) { }
}
