import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'page-footer',
  templateUrl: './page-footer.html',
  styles: [`
    .footerlink {
      margin: 20px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .footerlink a {
      font-size: 12px;
    }
  `]
})
export class PageFooterComponent {
  public brand = environment.Brand;
  public env = environment;
  public year = (new Date()).getFullYear();
}
