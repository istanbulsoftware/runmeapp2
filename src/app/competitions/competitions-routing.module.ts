import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompetitionsPage } from './competitions.page';

const routes: Routes = [
  {
    path: '',
    component: CompetitionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompetitionsPageRoutingModule {}
