import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularMaterialModule } from './modules/angular-material.module';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { OpenNewClientDialogComponent } from './dialogs/open-new-client-dialog/open-new-client-dialog.component';
import { OpenNewClientDetailDialogComponent } from './dialogs/open-new-client-detail-dialog/open-new-client-detail-dialog.component';
import { YesNoDialogComponent } from './dialogs/yes-no-dialog/yes-no-dialog.component';
import { OpenNewAccountDialogComponent } from './dialogs/open-new-account-dialog/open-new-account-dialog.component';
import { LoginComponent } from './components/login/login.component';
import { TokenInterceptor } from './services/user/token.interceptor';
import { OpenNewBankerDialogComponent } from './dialogs/open-new-banker-dialog/open-new-banker-dialog.component';
import { BankerDetailComponent } from './components/banker-detail/banker-detail.component';
import { MatIconModule } from '@angular/material/icon';
import { ClientLogComponent } from './components/banker-detail/client-log/client-log.component';
import { AccountLogComponent } from './components/banker-detail/account-log/account-log.component';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './modules/app-routing.module'

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
    OpenNewBankerDialogComponent,
    BankerDetailComponent,
    ClientLogComponent,
    AccountLogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ChartsModule,
    UtilComponentModule,
    FormsModule,
    HttpClientModule,
    MatIconModule
  ],
  providers: [
    ChartService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    provideAnimations(),
    provideRouter(routes, withViewTransitions()
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
