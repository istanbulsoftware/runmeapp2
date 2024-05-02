import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelationTestPage } from './relation-test.page';

const routes: Routes = [
  {
    path: '',
    component: RelationTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelationTestPageRoutingModule {}
