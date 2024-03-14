import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CanvasJSAngularChartsModule
  ],
  exports: [CanvasJSAngularChartsModule],
})
export class ChartsModule { }
