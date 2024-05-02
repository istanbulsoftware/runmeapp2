import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertPrivatePage } from './advert-private.page';

const routes: Routes = [
  {
    path: '',
    component: AdvertPrivatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertPrivatePageRoutingModule {}
