import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdsPage } from './ads.page';

const routes: Routes = [
  {
    path: '',
    component: AdsPage
  },
  {
    path: 'new-ad',
    loadChildren: () => import('./new-ad/new-ad.module').then( m => m.NewAdPageModule)
  },
  {
    path: 'preview/:id',
    loadChildren: () => import('./preview/preview.module').then( m => m.PreviewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdsPageRoutingModule {}
