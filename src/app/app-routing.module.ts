import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AutoLoginGuard } from './auto-login.guard';
import { EmailVerificarionGuard } from './email-verificarion.guard';


const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'ask-question',
    loadChildren: () => import('./ask-question/ask-question.module').then( m => m.AskQuestionPageModule)
  },
  {
    path: 'best-list',
    loadChildren: () => import('./best-list/best-list.module').then( m => m.BestListPageModule)
  },
  {
    path: 'blocked-users',
    loadChildren: () => import('./blocked-users/blocked-users.module').then( m => m.BlockedUsersPageModule)
  },
  {
    path: 'walletsubs',
    loadChildren: () => import('./walletsubs/walletsubs.module').then( m => m.WalletsubsPageModule)
  },
  {
    path: 'boost',
    loadChildren: () => import('./boost/boost.module').then( m => m.BoostPageModule)
  },
  {
    path: 'chat/:id',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'edit-account',
    loadChildren: () => import('./edit-account/edit-account.module').then( m => m.EditAccountPageModule)
  },
  {
    path: 'edit-email',
    loadChildren: () => import('./edit-email/edit-email.module').then( m => m.EditEmailPageModule)
  },
  {
    path: 'edit-password',
    loadChildren: () => import('./edit-password/edit-password.module').then( m => m.EditPasswordPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canLoad: [AuthGuard]

  },
  {
    path: 'info/:id',
    loadChildren: () => import('./info/info.module').then( m => m.InfoPageModule)
  },
  {
    path: 'email-verification',
    loadChildren: () => import('./email-verification/email-verification.module').then( m => m.EmailVerificationPageModule)
  },
  {
    path: 'setopt',
    loadChildren: () => import('./setopt/setopt.module').then( m => m.SetoptPageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),

  },
  {
    path: 'my-questions',
    loadChildren: () => import('./my-questions/my-questions.module').then( m => m.MyQuestionsPageModule)
  },
  {
    path: 'photo-viewer/:id/:who',
    loadChildren: () => import('./photo-viewer/photo-viewer.module').then( m => m.PhotoViewerPageModule)
  },
  {
    path: 'profile/:id',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'social-accounts',
    loadChildren: () => import('./social-accounts/social-accounts.module').then( m => m.SocialAccountsPageModule)
  },
  {
    path: 'user-photos',
    loadChildren: () => import('./user-photos/user-photos.module').then( m => m.UserPhotosPageModule)
  },
  {
    path: 'walletcoin',
    loadChildren: () => import('./walletcoin/walletcoin.module').then( m => m.WalletcoinPageModule)
  },
  {
    path: 'tab5',
    loadChildren: () => import('./tab5/tab5.module').then( m => m.Tab5PageModule)
  },
  {
    path: 'tab3',
    loadChildren: () => import('./tab3/tab3.module').then( m => m.Tab3PageModule)
  },
  {
    path: 'showimage',
    loadChildren: () => import('./showimage/showimage.module').then( m => m.ShowimagePageModule)
  },
  {
    path: 'watch-ads',
    loadChildren: () => import('./watch-ads/watch-ads.module').then( m => m.WatchAdsPageModule)
  },
  {
    path: 'filter',
    loadChildren: () => import('./filter/filter.module').then( m => m.FilterPageModule)
  },
  {
    path: 'filter-result',
    loadChildren: () => import('./filter-result/filter-result.module').then( m => m.FilterResultPageModule)
  },
  {
    path: 'forum',
    loadChildren: () => import('./forum/forum.module').then( m => m.ForumPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'languages',
    loadChildren: () => import('./languages/languages.module').then( m => m.LanguagesPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'forum-detail/:id',
    loadChildren: () => import('./forum-detail/forum-detail.module').then( m => m.ForumDetailPageModule)
  },
  {
    path: 'advert',
    loadChildren: () => import('./advert/advert.module').then( m => m.AdvertPageModule)
  },
  {
    path: 'advert-detail/:id',
    loadChildren: () => import('./advert-detail/advert-detail.module').then( m => m.AdvertDetailPageModule)
  },
  {
    path: 'mylists',
    loadChildren: () => import('./mylists/mylists.module').then( m => m.MylistsPageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'my-forum',
    loadChildren: () => import('./my-forum/my-forum.module').then( m => m.MyForumPageModule)
  },
  {
    path: 'favorite-forum',
    loadChildren: () => import('./favorite-forum/favorite-forum.module').then( m => m.FavoriteForumPageModule)
  },
  {
    path: 'advert-real',
    loadChildren: () => import('./advert-real/advert-real.module').then( m => m.AdvertRealPageModule)
  },
  {
    path: 'advert-create/:id',
    loadChildren: () => import('./advert-create/advert-create.module').then( m => m.AdvertCreatePageModule)
  },
  {
    path: 'location-set',
    loadChildren: () => import('./location-set/location-set.module').then( m => m.LocationSetPageModule)
  },
  {
    path: 'routes',
    loadChildren: () => import('./routes/routes.module').then( m => m.RoutesPageModule)
  },
  {
    path: 'routes-details/:id',
    loadChildren: () => import('./routes-details/routes-details.module').then( m => m.RoutesDetailsPageModule)
  },
  {
    path: 'picklocation',
    loadChildren: () => import('./picklocation/picklocation.module').then( m => m.PicklocationPageModule)
  },
  {
    path: 'location-settings',
    loadChildren: () => import('./location-settings/location-settings.module').then( m => m.LocationSettingsPageModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then( m => m.MyProfilePageModule)
  },
  {
    path: 'avatar',
    loadChildren: () => import('./avatar/avatar.module').then( m => m.AvatarPageModule)
  },
  {
    path: 'advert-private',
    loadChildren: () => import('./advert-private/advert-private.module').then( m => m.AdvertPrivatePageModule)
  },
  {
    path: 'car-registeration',
    loadChildren: () => import('./car-registeration/car-registeration.module').then( m => m.CarRegisterationPageModule)
  },

  {
    path: 'car-registeration2',
    loadChildren: () => import('./car-registeration2/car-registeration2.module').then( m => m.CarRegisteration2PageModule)
  },
  {
    path: 'car-registeration3',
    loadChildren: () => import('./car-registeration3/car-registeration3.module').then( m => m.CarRegisteration3PageModule)
  },
  {
    path: 'car-registeration4/:cat',
    loadChildren: () => import('./car-registeration4/car-registeration4.module').then( m => m.CarRegisteration4PageModule)
  },
  {
    path: 'car-registeration5',
    loadChildren: () => import('./car-registeration5/car-registeration5.module').then( m => m.CarRegisteration5PageModule)
  },
  {
    path: 'uploads/:id',
    loadChildren: () => import('./uploads/uploads.module').then( m => m.UploadsPageModule)
  },
  {
    path: 'comments',
    loadChildren: () => import('./comments/comments.module').then( m => m.CommentsPageModule)
  },
  {
    path: 'finance',
    loadChildren: () => import('./finance/finance.module').then( m => m.FinancePageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'select-date',
    loadChildren: () => import('./select-date/select-date.module').then( m => m.SelectDatePageModule)
  },
  {
    path: 'select-item/:id',
    loadChildren: () => import('./select-item/select-item.module').then( m => m.SelectItemPageModule)
  },
  {
    path: 'stats',
    loadChildren: () => import('./stats/stats.module').then( m => m.StatsPageModule)
  },
  {
    path: 'search-list',
    loadChildren: () => import('./search-list/search-list.module').then( m => m.SearchListPageModule)
  },
  {
    path: 'filters',
    loadChildren: () => import('./filters/filters.module').then( m => m.FiltersPageModule)
  },
  {
    path: 'competitions',
    loadChildren: () => import('./competitions/competitions.module').then( m => m.CompetitionsPageModule)
  },
  {
    path: 'map-page',
    loadChildren: () => import('./map-page/map-page.module').then( m => m.MapPagePageModule)
  },
  {
    path: 'map2',
    loadChildren: () => import('./map2/map2.module').then( m => m.Map2PageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
