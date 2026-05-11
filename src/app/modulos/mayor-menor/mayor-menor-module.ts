import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MayorMenorComponent } from './mayor-menor-component/mayor-menor-component';
import { RouterModule,Routes } from '@angular/router';

const routes : Routes=[{path: 'mayor-menor', component: MayorMenorComponent}];
@NgModule({
  declarations: [MayorMenorComponent],
  imports: [CommonModule,RouterModule.forChild(routes)],
})
export class MayorMenorModule {}
