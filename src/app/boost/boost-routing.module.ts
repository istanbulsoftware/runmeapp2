import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoostPage } from './boost.page';

const routes: Routes = [
  {
    path: '',
    component: BoostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoostPageRoutingModule {}
