import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutesDetailsPage } from './routes-details.page';

const routes: Routes = [
  {
    path: '',
    component: RoutesDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutesDetailsPageRoutingModule {}
