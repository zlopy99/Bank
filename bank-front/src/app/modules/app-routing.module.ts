import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { ClientsOverviewComponent } from '../components/clients-overview/clients-overview.component';
import { AccountsOverviewComponent } from '../components/accounts-overview/accounts-overview.component';
import { ClientsDetailComponent } from '../components/clients-detail/clients-detail.component';
import { BankersOverviewComponent } from '../components/bankers-overview/bankers-overview.component';
import { LoginComponent } from '../components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'clients', component: ClientsOverviewComponent },
  { path: 'clients/detail', component: ClientsDetailComponent },
  { path: 'accounts', component: AccountsOverviewComponent },
  { path: 'bankers', component: BankersOverviewComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
