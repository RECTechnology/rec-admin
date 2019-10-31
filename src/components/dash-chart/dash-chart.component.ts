/* tslint:disable */
import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlesService } from '../../services/controles/controles.service';

declare let Morris, _;

@Component({
  selector: 'dash-chart',
  styleUrls: [
    './dash-chart.css',
  ],
  templateUrl: './dash-chart.component.html',
})
export class DashChart implements AfterViewInit {
  chart_: any;
  public id: string = String(Math.random());
  @Input() public title = '';
  @Input() public timeframes = DashChart.DefaultTimeframes;
  @Input() public selectedTimeframe = DashChart.DefaultTimeframes[0];
  @Input() public colors = DashChart.DefaultColors;
  @Input() public labels = ['A', 'B'];
  @Input() public data = [
    { d: '06-08-2018 12:00:00', a: 100, b: 90 },
    { d: '06-09-2018 12:00:00', a: 75, b: 65 },
    { d: '06-10-2018 12:00:00', a: 50, b: 40 },
    { d: '06-11-2018 12:00:00', a: 75, b: 65 },
    { d: '06-12-2018 12:00:00', a: 50, b: 40 },
    { d: '06-13-2018 12:00:00', a: 75, b: 65 },
    { d: '06-14-2018 12:00:00', a: 100, b: 90 },
  ];
  @Output() public changedTimeframe: EventEmitter<any> = new EventEmitter();

  public ngAfterViewInit() {
    const morrisData = {
      element: this.id,
      data: this.data,
      xkey: 'd',
      lineColors: this.colors,
      lineWidth: 1.5,
      height: 300,
      smooth: false,
      fillOpacity: 0.4,
      ykeys: ['a', 'b'],
      labels: this.labels,
      pointSize: 0,
      hideHover: true,
      gridTextColor: '#bababa',
      xLabelFormat: (d: Date) => {
        if (this.selectedTimeframe.value === 'year') {
          return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
        } else if (this.selectedTimeframe.value === 'month') {
          return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d.getDay()];
        } else if (this.selectedTimeframe.value === 'day') {
          return d.getHours();
        }
      },
    }

    this.chart_ = new Morris.Area(morrisData);
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

  public selectTimeframe(timeframe) {
    this.selectedTimeframe = timeframe;
    this.changedTimeframe.emit(timeframe);
    try {
      this.chart_.redraw();
    } catch (error) {
      
    }
  }

  static DefaultTimeframes = [
    {
      name: 'Last Year',
      value: 'year',
    },
    {
      name: 'Last Month',
      value: 'month',
    },
    {
      name: 'Last Day',
      value: 'day',
    },
  ];

  static DefaultColors = [
    '#0098db', '#9ed7f1'
  ];
}
