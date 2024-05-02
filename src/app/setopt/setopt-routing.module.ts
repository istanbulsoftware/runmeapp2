import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetoptPage } from './setopt.page';

const routes: Routes = [
  {
    path: '',
    component: SetoptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetoptPageRoutingModule {}
