import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MylistsPage } from './mylists.page';

const routes: Routes = [
  {
    path: '',
    component: MylistsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MylistsPageRoutingModule {}
