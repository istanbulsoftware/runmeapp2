import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPhotosPage } from './user-photos.page';

const routes: Routes = [
  {
    path: '',
    component: UserPhotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPhotosPageRoutingModule {}
