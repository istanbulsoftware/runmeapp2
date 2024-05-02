import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TruecoinPage } from './truecoin.page';

const routes: Routes = [
  {
    path: '',
    component: TruecoinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TruecoinPageRoutingModule {}
