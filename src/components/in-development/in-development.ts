
import { Component } from '@angular/core';
import { ControlesService } from '../../services/controles/controles.service';

@Component({
  selector: 'in-development',
  templateUrl: './template.html',
})
export class InDevelopment {
  constructor(
    private controles: ControlesService,
  ) { }
}
