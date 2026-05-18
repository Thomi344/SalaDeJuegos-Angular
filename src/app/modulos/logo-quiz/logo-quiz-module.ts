import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoQuizComponent } from './logo-quiz-component/logo-quiz-component';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes=[{path: 'logo-quiz', component: LogoQuizComponent}];
@NgModule({
  declarations: [LogoQuizComponent],
  imports: [CommonModule,RouterModule.forChild(routes)],
})
export class LogoQuizModule {}
