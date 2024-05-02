import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyForumPage } from './my-forum.page';

const routes: Routes = [
  {
    path: '',
    component: MyForumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyForumPageRoutingModule {}
