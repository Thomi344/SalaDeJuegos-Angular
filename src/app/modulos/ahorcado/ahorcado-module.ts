import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ahorcado } from './ahorcado-component/ahorcado';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes=[{path: 'ahorcado', component: Ahorcado}];

@NgModule({
  declarations: [Ahorcado],
  imports: [CommonModule,RouterModule.forChild(routes)],
})
export class AhorcadoModule {}
