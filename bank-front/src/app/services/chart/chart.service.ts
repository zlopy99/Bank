import { Injectable, OnDestroy } from '@angular/core';
import { AccountApiService } from '../account/account-api.service';
import { Observable, Subject, catchError, map, of, takeUntil } from 'rxjs';
import { ClientServiceApi } from '../client/client-api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ChartService implements OnDestroy {
  columnChartOptions: any;
  lineChartOptions: any;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _accountServiceApi: AccountApiService,
    private _clientServiceApi: ClientServiceApi,
    private toastr: ToastrService
  ) {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setPieChartOptions(): Observable<any> {
    return this._accountServiceApi.getAllAccountsOpenedLastMonth()
      .pipe(
        takeUntil(this.unsubscribe$),
        map(resp => {
          let pieDataSource = [];
          for (const r of resp) {
            let pomSource = { y: r.percentage, name: r.name }
            pieDataSource.push(pomSource);
          }
          return {
            exportEnabled: true,
            animationEnabled: true,
            theme: "light2",
            title: {
              text: "Accounts open monthly"
            },
            data: [{
              type: "pie",
              startAngle: 45,
              indexLabel: "{name}: {y}",
              yValueFormatString: "#,###.##'%'",
              dataPoints: pieDataSource
            }]
          };
        }),
        catchError(err => {
          this.toastr.error(err?.error?.message, 'Error');
          throw err;
        })
      );
  }

  setColumnChartOptions(): Observable<any> {
    return this._clientServiceApi.getAllOpenedAndClosedClientsYearly()
      .pipe(
        takeUntil(this.unsubscribe$),
        map(resp => {
          let opened = resp.filter(obj => obj.statusType === 'A');
          let closed = resp.filter(obj => obj.statusType === 'C');
          return {
            exportEnabled: true,
            animationEnabled: true,
            theme: "light2",
            title: {
              text: "Open - Closed clients yearly"
            },
            axisX: {
              labelAngle: -50
            },
            axisY: {
              title: "Number of clients"
            },
            toolTip: {
              shared: true
            },
            legend: {
              cursor: "pointer",
              itemclick: function (e: any) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                  e.dataSeries.visible = false;
                }
                else {
                  e.dataSeries.visible = true;
                }
                e.chart.render();
              }
            },
            data: [{
              type: "column",
              name: "Newly Open Clients",
              legendText: "Open Clients",
              showInLegend: true,
              dataPoints: [
                { label: new Date(0, 0).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 1)?.count ?? 0},
                { label: new Date(0, 1).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 2)?.count ?? 0},
                { label: new Date(0, 2).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 3)?.count ?? 0},
                { label: new Date(0, 3).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 4)?.count ?? 0},
                { label: new Date(0, 4).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 5)?.count ?? 0},
                { label: new Date(0, 5).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 6)?.count ?? 0},
                { label: new Date(0, 6).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 7)?.count ?? 0},
                { label: new Date(0, 7).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 8)?.count ?? 0},
                { label: new Date(0, 8).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 9)?.count ?? 0},
                { label: new Date(0, 9).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 10)?.count ?? 0},
                { label: new Date(0, 10).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 11)?.count ?? 0},
                { label: new Date(0, 11).toLocaleString('default', { month: 'long' }), y: opened.find(obj => obj.groupby === 12)?.count ?? 0},
              ]
            }, {
              type: "column",
              name: "Closed Clients",
              legendText: "Closed clients",
              axisYType: "secondary",
              showInLegend: true,
              dataPoints: [
                { label: new Date(0, 0).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 1)?.count ?? 0 },
                { label: new Date(0, 1).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 2)?.count ?? 0 },
                { label: new Date(0, 2).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 3)?.count ?? 0},
                { label: new Date(0, 3).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 4)?.count ?? 0},
                { label: new Date(0, 4).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 5)?.count ?? 0},
                { label: new Date(0, 5).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 6)?.count ?? 0},
                { label: new Date(0, 6).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 7)?.count ?? 0},
                { label: new Date(0, 7).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 8)?.count ?? 0},
                { label: new Date(0, 8).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 9)?.count ?? 0},
                { label: new Date(0, 9).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 10)?.count ?? 0},
                { label: new Date(0, 10).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 11)?.count ?? 0},
                { label: new Date(0, 11).toLocaleString('default', { month: 'long' }), y: closed.find(obj => obj.groupby === 12)?.count ?? 0},
              ]
            }]
          }
        }),
        catchError(err => {
          this.toastr.error(err?.error?.message, 'Error');
          throw err;
        })
      );
  }

  extractYearMonthAndDayFromString(dateString: string): number[] {
    let date = dateString.split('-');
    let newList: number[] = [];

    let year = parseInt(date[0]);
    let month = parseInt(date[1], 10);
    let day = parseInt(date[2], 10);

    newList.push(year);
    newList.push(month);
    newList.push(day);

    return newList;
  }

  setLineChartOptions() {
    return this._clientServiceApi.getAllClientsOpenedAndClosedLastWeek()
      .pipe(
        takeUntil(this.unsubscribe$),
        map(resp => {
          let openingDataSource = [];
          let closingDataSource = [];

          for (const r of resp) {
            if (r.flag === 'C') {
              let date = this.extractYearMonthAndDayFromString(r.closingDate);
              let data = { x: new Date(date[0], (date[1] - 1), date[2]), y: r.counter };
              closingDataSource.push(data);
            } else {
              let date = this.extractYearMonthAndDayFromString(r.openingDate);
              let data = { x: new Date(date[0], (date[1] - 1), date[2]), y: r.counter };
              openingDataSource.push(data);
            }
          }
          return {
            exportEnabled: true,
            animationEnabled: true,
            theme: "light2",
            title: {
              text: "Open - Closed clients weekly"
            },
            axisX: {
              valueFormatString: "DDD DD MMM",
              labelAngle: -50,
              crosshair: {
                enabled: true,
                snapToDataPoint: true
              }
            },
            axisY: {
              title: "Number of clients",
              crosshair: {
                enabled: true
              }
            },
            toolTip: {
              shared: true
            },
            legend: {
              cursor: "pointer",
              itemclick: function (e: any) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                  e.dataSeries.visible = false;
                } else {
                  e.dataSeries.visible = true;
                }
                e.chart.render();
              }
            },
            data: [{
              type: "line",
              name: "Open Clients",
              showInLegend: true,
              dataPoints: openingDataSource
            },
            {
              type: "line",
              name: "Closed Clients",
              showInLegend: true,
              dataPoints: closingDataSource
            }]
          };
        }),
        catchError(err => {
          this.toastr.error(err?.error?.message, 'Error');
          throw err;
        })
      );
  }
}
