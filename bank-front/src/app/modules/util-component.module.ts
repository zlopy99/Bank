import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardHeaderComponent } from '../util-components/card-header/card-header.component';
import { CardTableComponent } from '../util-components/card-table/card-table.component';
import { AngularMaterialModule } from './angular-material.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from './charts.module';
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [CardHeaderComponent, CardTableComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ChartsModule,
  ],
  exports: [CardHeaderComponent, CardTableComponent],
  providers: [DatePipe],
})
export class UtilComponentModule { }
