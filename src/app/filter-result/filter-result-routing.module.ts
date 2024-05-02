import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterResultPage } from './filter-result.page';

const routes: Routes = [
  {
    path: '',
    component: FilterResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterResultPageRoutingModule {}
