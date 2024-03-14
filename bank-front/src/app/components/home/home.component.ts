import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartService } from '../../services/chart/chart.service';
import { ClientServiceApi } from '../../services/client/client-api.service';
import { Subject, takeUntil } from 'rxjs';
import { AccountDto, ClientAccountDto, ClientDto } from '../../util-components/dto/dto-interfaces';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
	columnChartOptions: any;
	pieChartOptions: any;
	lineChartOptions: any;
	CLIENT_DATA: ClientDto[] = [];
	ACCOUNT_DATA: AccountDto[] = [];
	displayedColumnsClient: string[] = ['id', 'name', 'lastName'];
	displayedColumnsAccount: string[] = ['id', 'name'];
	dataSourceClient = this.CLIENT_DATA;
	dataSourceAccount = this.ACCOUNT_DATA;
	private unsubscribe$ = new Subject<void>();
	clientAccountDto!: ClientAccountDto;

	constructor(
		private _chartService: ChartService,
		private _clientApiService: ClientServiceApi
	) {
		this.columnChartOptions = this._chartService.setColumnChartOptions()
		.pipe(takeUntil(this.unsubscribe$))
		.subscribe({
			next: (resp) => {
				this.columnChartOptions = resp;
			}, error: (err) => {
				console.error(err);
			}
		});
		this.lineChartOptions = this._chartService.setLineChartOptions()
		.pipe(takeUntil(this.unsubscribe$))
		.subscribe({
			next: (resp) => {
				this.lineChartOptions = resp;
			},
			error: (err) => {
				console.error(err);
			}
		});
		this._chartService.setPieChartOptions()
		.pipe(takeUntil(this.unsubscribe$))
		.subscribe({
			next: (resp) => {
				this.pieChartOptions = resp;
			},
			error: (err) => {
				console.error(err);
			}
		});
	}

	ngOnInit() {
		this._clientApiService.getFirstFiveClientsAndAccounts()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: async (resp) => {
					this.clientAccountDto = resp;
					await this.setClientAndAccountFirstFiveTables();
				},
				error: (error) => {
					console.error(error);
				}
			})
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	async setClientAndAccountFirstFiveTables() {
		this.CLIENT_DATA = this.clientAccountDto.clientDto !== undefined
			? this.clientAccountDto.clientDto
			: [];
		this.ACCOUNT_DATA = this.clientAccountDto.accountDto !== undefined
			? this.clientAccountDto.accountDto
			: [];
		this.dataSourceAccount = this.ACCOUNT_DATA;
		this.dataSourceClient = this.CLIENT_DATA;
	}
}
