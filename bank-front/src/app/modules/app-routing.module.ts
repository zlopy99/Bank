import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { ClientsOverviewComponent } from '../components/clients-overview/clients-overview.component';
import { AccountsOverviewComponent } from '../components/accounts-overview/accounts-overview.component';
import { ClientsDetailComponent } from '../components/clients-detail/clients-detail.component';
import { BankersOverviewComponent } from '../components/bankers-overview/bankers-overview.component';
import { LoginComponent } from '../components/login/login.component';
import { authGuardGuard } from '../services/guard/auth-guard.guard';
import { isValueDefined } from '../util-components/util-methods/util-methods';
import { BankerDetailComponent } from '../components/banker-detail/banker-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuardGuard] },
  { path: 'clients', component: ClientsOverviewComponent, canActivate: [authGuardGuard] },
  { path: 'clients/detail', component: ClientsDetailComponent, canActivate: [authGuardGuard] },
  { path: 'accounts', component: AccountsOverviewComponent, canActivate: [authGuardGuard] },
  { path: 'bankers', component: BankersOverviewComponent, canActivate: [authGuardGuard] },
  { path: 'bankers/detail', component: BankerDetailComponent, canActivate: [authGuardGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: isValueDefined(localStorage.getItem('access_token')) ? '/home' : '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
