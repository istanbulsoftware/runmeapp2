import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarRegisteration5Page } from './car-registeration5.page';

const routes: Routes = [
  {
    path: '',
    component: CarRegisteration5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarRegisteration5PageRoutingModule {}
