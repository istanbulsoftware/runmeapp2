import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarRegisteration4Page } from './car-registeration4.page';

const routes: Routes = [
  {
    path: '',
    component: CarRegisteration4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarRegisteration4PageRoutingModule {}
