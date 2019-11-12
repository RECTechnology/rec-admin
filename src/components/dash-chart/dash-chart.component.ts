/* tslint:disable */
import { Component, AfterViewInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DashboardValidIntervals } from 'src/services/dashboard/dashboard.service';
import * as moment from 'moment';
import * as Highcharts from 'highcharts';
import { TranslateService } from '@ngx-translate/core';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

const formatters = {
  year: (val) => Highcharts.dateFormat('%b \'%y', val),
  month: (val) => Highcharts.dateFormat('%e of %b', val),
  day: (val) => Highcharts.dateFormat('%H:%M', val),
};

const intervals = {
  year: 30 * 24 * 3600 * 1000,
  month: 24 * 3600 * 1000,
  day: 3600 * 1000
};

@Component({
  selector: 'dash-chart',
  styleUrls: [
    './dash-chart.css',
  ],
  templateUrl: './dash-chart.component.html',
})
export class DashChart {
  public chart_: Highcharts.Chart;
  public id: string = String(Math.random());

  @Input() public title = '';
  @Input() public timeframes = DashChart.DefaultTimeframes;
  @Input() public selectedTimeframe: any = DashChart.DefaultTimeframes[0];
  @Input() public colors = DashChart.DefaultColors;
  @Input() public labels = ['A', 'B'];
  @Input() public data = [];
  @Input() public twoAxis = false;
  @Output('changed') public changedTimeframe: EventEmitter<any> = new EventEmitter();

  public options: any = {};

  constructor(
    @Inject(DOCUMENT) public document,
    public translate: TranslateService,
  ) {
    translate.onLangChange.subscribe(res => {
      console.log('changed lang');
      if (this.chart_) {
        this.chart_.setTitle({ text: this.translate.instant(this.title) }, null, true);
      }
    });
  }

  public update(dataA: any, dataB) {
    console.log('this.ssefjkajk', this.selectedTimeframe);
    let self = this;
    this.options = {
      chart: {
        type: 'area',
        height: 250,
      },
      plotOptions: {
        area: {
          fillOpacity: 0.4,
          opacity: 0.6,
        },
        series: {
          marker: {
            radius: 2,
            lineWidth: 1
          },
        },
      },
      title: {
        text: this.translate.instant(this.title)
      },
      credits: {
        enabled: false
      },
      colors: this.colors,
      tooltip: {
        formatter: function () {
          return 'Date: ' + formatters[self.selectedTimeframe.value](this.x) + '\n Value: ' + this.y.toFixed(2);
        }
      },
      xAxis: {
        type: 'datetime',
        labels: {
          formatter: function () {
            return formatters[self.selectedTimeframe.value](this.value);
          }
        },
        // pointStart: moment().subtract(1, this.selectedTimeframe.value).toDate().getUTCDate(),
      },
      yAxis: [{ // left y axis
        title: {
          text: null,
          style: {
            color: this.colors[0]
          }
        },
        labels: {
          align: 'left',
          x: -10,
          y: 16,
          format: '{value:.,0f}',
          style: {
            color: this.colors[0]
          }
        },
        showFirstLabel: false,
      }, this.twoAxis ? { // right y axis
        opposite: true,
        title: {
          text: null,
          style: {
            color: this.colors[1],
          }
        },
        labels: {
          align: 'right',
          x: -10,
          y: 16,
          format: '{value:.,0f} recs',
          style: {
            color: this.colors[1]
          },
          formatter: function () {
            if (this.value >= 1E6) {
              return this.value / 1000000 + 'M';
            } else if (this.value < 1000) {
              return this.value;
            }
            return this.value / 1000 + 'k';
          }
        },
        showFirstLabel: false
      } : null].filter(_ => _),
      series: [
        {
          name: this.labels[0],
          data: dataA,
          yAxis: 0
        },
        {
          name: this.labels[1],
          data: dataB,
          yAxis: this.twoAxis ? 1 : 0
        }
      ]
    };

    this.chart_ = Highcharts.chart(this.id, this.options);
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
