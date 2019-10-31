import { Component, Input } from '@angular/core';
import { ControlesService } from '../../services/controles/controles.service';

@Component({
  selector: 'dash-agregation',
  styles: [
    `.title { text-transform: uppercase; font-size: 12px; opacity: 0.6; text-align: center; }`,
    `.value { font-size: 24px; font-weigh: 200}`,
    `.agregation {
      padding: 10px; display: flex; flex-direction: column;
      border-radius: 4px;
      align-items: center;
      height: 71px;
      justify-content: flex-start;
      position: relative;
    }`,
  ],
  templateUrl: './agregation.component.html',
})
export class Agregation {
  @Input() public title: string = 'Agregation';
  @Input() public value: any = '';
  @Input() public classes: string = 'bg-white';
  @Input() public img: string = null;

  constructor(
    private controles: ControlesService,
  ) { }
}
