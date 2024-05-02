import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarRegisterationPage } from './car-registeration.page';

const routes: Routes = [
  {
    path: '',
    component: CarRegisterationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarRegisterationPageRoutingModule {}
