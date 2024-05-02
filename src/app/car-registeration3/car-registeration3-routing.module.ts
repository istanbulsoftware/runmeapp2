import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarRegisteration3Page } from './car-registeration3.page';

const routes: Routes = [
  {
    path: '',
    component: CarRegisteration3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarRegisteration3PageRoutingModule {}
