import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertCreatePage } from './advert-create.page';

const routes: Routes = [
  {
    path: '',
    component: AdvertCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertCreatePageRoutingModule {}
