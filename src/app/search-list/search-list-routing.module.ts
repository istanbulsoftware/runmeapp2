import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchListPage } from './search-list.page';

const routes: Routes = [
  {
    path: '',
    component: SearchListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchListPageRoutingModule {}
