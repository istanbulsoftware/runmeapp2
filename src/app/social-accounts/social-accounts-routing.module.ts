import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SocialAccountsPage } from './social-accounts.page';

const routes: Routes = [
  {
    path: '',
    component: SocialAccountsPage
  },
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialAccountsPageRoutingModule {}
