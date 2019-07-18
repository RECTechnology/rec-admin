import { Component, Input } from '@angular/core';
import { ControlesService } from '../../services/controles/controles.service';

@Component({
  selector: 'dash-agregation',
  styles: [
    `.title { text-transform: uppercase; font-size: 12px; opacity: 0.6; text-align: center; }`,
    `.value { font-size: 24px; }`,
    `.agregation {
      padding: 10px; display: flex; flex-direction: column;
      align-items: center; height: 100px; justify-content: flex-start
    }`,
  ],
  templateUrl: './agregation.component.html',
})
export class Agregation {
  @Input() public title: string = 'Agregation';
  @Input() public value: any = '';
  @Input() public classes: string = 'bg-white';

  constructor(
    private controles: ControlesService,
  ) { }
}
