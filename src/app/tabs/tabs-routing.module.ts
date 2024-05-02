import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from './../auth.guard';
import { EmailVerificarionGuard } from './../email-verificarion.guard';
import { AutoLoginGuard } from './../auto-login.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [


      {
        path: 'advert-real',
        loadChildren: () => import('../advert-real/advert-real.module').then(m => m.AdvertRealPageModule),
        canLoad: [AuthGuard, EmailVerificarionGuard]
      },
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'advert-create',
        loadChildren: () => import('../advert-create/advert-create.module').then(m => m.AdvertCreatePageModule)
      },
      {
        path: 'competitions',
        loadChildren: () => import('../competitions/competitions.module').then(m => m.CompetitionsPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab5',
        loadChildren: () => import('../tab5/tab5.module').then(m => m.Tab5PageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'my-profile',
        loadChildren: () => import('../my-profile/my-profile.module').then(m => m.MyProfilePageModule)
      },
      {
        path: 'edit-profile',
        loadChildren: () => import('../edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
      },
      {
        path: 'favorites',
        loadChildren: () => import('../favorites/favorites.module').then(m => m.FavoritesPageModule)
      },
      {
        path: 'list',
        loadChildren: () => import('../list/list.module').then(m => m.ListPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/advert-real',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/advert-real',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
