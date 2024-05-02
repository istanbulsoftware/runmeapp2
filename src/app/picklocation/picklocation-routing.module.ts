import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PicklocationPage } from './picklocation.page';

const routes: Routes = [
  {
    path: '',
    component: PicklocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PicklocationPageRoutingModule {}
