import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarRegisteration2Page } from './car-registeration2.page';

const routes: Routes = [
  {
    path: '',
    component: CarRegisteration2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarRegisteration2PageRoutingModule {}
