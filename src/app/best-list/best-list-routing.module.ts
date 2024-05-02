import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BestListPage } from './best-list.page';

const routes: Routes = [
  {
    path: '',
    component: BestListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BestListPageRoutingModule {}
