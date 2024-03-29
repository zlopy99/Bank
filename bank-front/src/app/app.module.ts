import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularMaterialModule } from './modules/angular-material.module';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChartsModule } from './modules/charts.module';
import { ChartService } from './services/chart/chart.service';
import { UtilComponentModule } from './modules/util-component.module';
import { ClientsOverviewComponent } from './components/clients-overview/clients-overview.component';
import { AccountsOverviewComponent } from './components/accounts-overview/accounts-overview.component';
import { FormsModule } from '@angular/forms';
import { ClientsDetailComponent } from './components/clients-detail/clients-detail.component';
import { BankersOverviewComponent } from './components/bankers-overview/bankers-overview.component';
import { HttpClientModule } from '@angular/common/http';
import { OpenNewClientDialogComponent } from './dialogs/open-new-client-dialog/open-new-client-dialog.component';
import { OpenNewClientDetailDialogComponent } from './dialogs/open-new-client-detail-dialog/open-new-client-detail-dialog.component';
import { YesNoDialogComponent } from './dialogs/yes-no-dialog/yes-no-dialog.component';
import { OpenNewAccountDialogComponent } from './dialogs/open-new-account-dialog/open-new-account-dialog.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    FooterComponent,
    ClientsOverviewComponent,
    AccountsOverviewComponent,
    ClientsDetailComponent,
    BankersOverviewComponent,
    OpenNewClientDialogComponent,
    OpenNewClientDetailDialogComponent,
    YesNoDialogComponent,
    OpenNewAccountDialogComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ChartsModule,
    UtilComponentModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ChartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
