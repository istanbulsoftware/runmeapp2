import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoriteForumPageRoutingModule } from './favorite-forum-routing.module';

import { FavoriteForumPage } from './favorite-forum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoriteForumPageRoutingModule
  ],
  declarations: [FavoriteForumPage]
})
export class FavoriteForumPageModule {}
