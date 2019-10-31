/* tslint:disable */
import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
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
    { d: '2018-06-08 12:00:00', a: 100, b: 90 },
    { d: '2018-06-09 12:00:00', a: 75, b: 65 },
    { d: '2018-06-10 12:00:00', a: 50, b: 40 },
    { d: '2018-06-11 12:00:00', a: 75, b: 65 },
    { d: '2018-06-12 12:00:00', a: 50, b: 40 },
    { d: '2018-06-13 12:00:00', a: 75, b: 65 },
    { d: '2018-06-14 12:00:00', a: 100, b: 90 },
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
        console.log(d);
        if (this.selectedTimeframe.value === 'year') {
          return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
        } else if (this.selectedTimeframe.value === 'month') {
          return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d.getDay()] + ' ' + d.getDate();
        } else if (this.selectedTimeframe.value === 'day') {
          return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
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
