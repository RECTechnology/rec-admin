/* tslint:disable */
import { Component, AfterViewInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DashboardValidIntervals } from 'src/services/dashboard/dashboard.service';
import * as moment from 'moment';

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
  @Input() public selectedTimeframe: any = DashChart.DefaultTimeframes[0];
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
  @Output('changed') public changedTimeframe: EventEmitter<any> = new EventEmitter();


  constructor(@Inject(DOCUMENT) public document) {

  }

  /**
   * ngAfterViewInit
   */
  public ngAfterViewInit() {
    this.update();
  }

  public update(data?) {
    if (!data || data.length <= 0) {
      data = DashChart.getEmptyData(this.selectedTimeframe.value);
    }

    const morrisData = {
      element: this.id,
      data: data || this.data,
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
          return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d.getDay()] + ' ' + d.getDate();
        } else if (this.selectedTimeframe.value === 'day') {
          return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
        }
      },
    }

    if (this.chart_) {
      document.getElementById(this.id).innerHTML = '';
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
    this.changedTimeframe.emit(timeframe.value);
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

  static getEmptyData(timeframe: DashboardValidIntervals) {
    let today = moment();
    let data = [];

    if (timeframe === 'year') {
      let yearAgo = today.clone().subtract(1, 'year');
      data.push({ d: yearAgo.toDate().getTime(), a: 0, b: 0 });
      data.push({ d: today.toDate().getTime(), a: 0, b: 0 });
    } else if (timeframe === 'month') {
      let monthAgo = today.clone().subtract(1, 'month');
      data.push({ d: monthAgo.toDate().getTime(), a: 0, b: 0 });
      data.push({ d: today.toDate().getTime(), a: 0, b: 0 });
    } else if (timeframe === 'day') {
      data.push({ d: today.toDate().getTime(), a: 0, b: 0 });
      for (let i = 1; i <= 25; i++) {
        let dayAgo = today.clone().subtract(i, 'hour');
        data.push({ d: dayAgo.toDate().getTime(), a: 0, b: 0 });
      }
    }
    return data.reverse();
  };
}
