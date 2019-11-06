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
  public chart_: any;
  public id: string = String(Math.random());

  @Input() public title = '';
  @Input() public timeframes = DashChart.DefaultTimeframes;
  @Input() public selectedTimeframe: any = DashChart.DefaultTimeframes[0];
  @Input() public colors = DashChart.DefaultColors;
  @Input() public labels = ['A', 'B'];
  @Input() public data = [];
  @Output('changed') public changedTimeframe: EventEmitter<any> = new EventEmitter();


  constructor(@Inject(DOCUMENT) public document) {}

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
      smooth: true,
      fillOpacity: 0.4,
      ykeys: ['a', 'b'],
      labels: this.labels,
      pointSize: 0,
      hideHover: true,
      gridTextColor: '#bababa',
      parseTime: false,
      behaveLikeLine: true
    }

    if (this.chart_) {
      this.chart_.setData(data || this.data);
    } else {
      this.chart_ = new Morris.Area(morrisData);
    }

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
      data.push({ d: yearAgo.format('DD-MM-YYYY'), a: 0, b: 0 });
      data.push({ d: today.format('DD-MM-YYYY'), a: 0, b: 0 });
    } else if (timeframe === 'month') {
      let monthAgo = today.clone().subtract(1, 'month');
      data.push({ d: monthAgo.format('MM-YYYY'), a: 0, b: 0 });
      data.push({ d: today.format('MM-YYYY'), a: 0, b: 0 });
    } else if (timeframe === 'day') {
      data.push({ d: today.toDate().getTime(), a: 0, b: 0 });
      for (let i = 1; i <= 25; i++) {
        let dayAgo = today.clone().subtract(i, 'hour');
        data.push({ d: dayAgo.format('hh:mm'), a: 0, b: 0 });
      }
    }
    return data.reverse();
  };
}
