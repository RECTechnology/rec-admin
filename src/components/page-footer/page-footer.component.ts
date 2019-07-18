import { Component, OnInit } from '@angular/core';
import { ControlesService } from '../../services/controles/controles.service';
import { Brand } from '../../environment/brand';
import { environment } from '../../environment/environment';

@Component({
  selector: 'page-footer',
  templateUrl: '../../components/page-footer/page-footer.html',
})
export class PageFooterComponent {
  public brand = Brand;
  public env = environment;
  public year = (new Date()).getFullYear();
  constructor(
    private contrService: ControlesService,
  ) { }
}
