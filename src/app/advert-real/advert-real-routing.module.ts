import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertRealPage } from './advert-real.page';

const routes: Routes = [
  {
    path: '',
    component: AdvertRealPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertRealPageRoutingModule {}
