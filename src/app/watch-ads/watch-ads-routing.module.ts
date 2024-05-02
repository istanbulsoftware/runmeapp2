import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WatchAdsPage } from './watch-ads.page';

const routes: Routes = [
  {
    path: '',
    component: WatchAdsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WatchAdsPageRoutingModule {}
