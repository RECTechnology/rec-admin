/* tslint:disable */
import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ControlesService } from '../../services/controles/controles.service';

declare let Morris, _;

const morrisData = function (id) {
  return {
    element: id,
    data: [
      { d: 0, a: 100, b: 90 },
      { d: 0, a: 75, b: 65 },
      { d: 0, a: 50, b: 40 },
      { d: 0, a: 75, b: 65 },
      { d: 0, a: 50, b: 40 },
      { d: 0, a: 75, b: 65 },
      { d: 0, a: 100, b: 90 },
    ],
    xkey: 'd',
    ykeys: ['a', 'b'],
    labels: ['Series A', 'Series B'],
    xLabelFormat(d) {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
    },
  };
};

@Component({
  selector: 'dash-chart',
  styleUrls: [
    './dash-chart.css',
  ],
  templateUrl: './dash-chart.component.html',
})
export class DashChart implements AfterViewInit {
  // tslint:disable-next-line: variable-name
  chart_: any;
  public id: string = String(Math.random());
  @Input() public title = '';

  public morris = {
    element: this.id,
    data: [
      { d: '06-08-2018', a: 100, b: 90 },
      { d: '06-09-2018', a: 75, b: 65 },
      { d: '06-10-2018', a: 50, b: 40 },
      { d: '06-11-2018', a: 75, b: 65 },
      { d: '06-12-2018', a: 50, b: 40 },
      { d: '06-13-2018', a: 75, b: 65 },
      { d: '06-14-2018', a: 100, b: 90 },
    ],
    xkey: 'd',
    lineColors: ['#0098db', '#9ed7f1'],
    height: 120,
    smooth: false,
    ykeys: ['a', 'b'],
    labels: ['Particular', 'Empresas'],
    xLabelFormat(d) {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
    },
  };

  constructor(
    private controles: ControlesService,
  ) { }

  public ngAfterViewInit() {
    this.chart_ = new Morris.Area(this.morris);
    (window as any).addEventListener('resize', () => {
      this.chart_.redraw();
    });
  }

  public ngOnDestroy() {
    (window as any).removeAllListeners('resize');
  }

  private formatChartData(data: any): any[] {
    const formated = [];
    for (const key in data) {
      if (key != 'scale' && key != 'currency') {
        const value: any = data[key];
        // value = value / Math.pow(10, data.scale);
        formated.push({
          month: key,
          v: +value.toFixed(data.scale),
        });
      }
    }
    return formated;
  }
}
