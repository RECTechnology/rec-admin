import { Component, OnInit, Input } from '@angular/core';
import { ControlesService } from '../../../services/controles/controles.service';

@Component({
  selector: 'collapse-card',
  styleUrls: ['./collapse-card.css'],
  templateUrl: './collapse-card.html',
})
export class CollapseCardComponent implements OnInit {
  @Input() public method: any = {};
  @Input('i') public index: number;
  public opened = false;

  constructor(
    private controles: ControlesService,
  ) { }

  public ngOnInit() {
    this.opened = this.index === 0;
  }

  public collapse() {
    this.opened = !this.opened;
  }
}
