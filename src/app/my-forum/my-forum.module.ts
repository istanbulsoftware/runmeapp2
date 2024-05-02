import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyForumPageRoutingModule } from './my-forum-routing.module';

import { MyForumPage } from './my-forum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyForumPageRoutingModule
  ],
  declarations: [MyForumPage]
})
export class MyForumPageModule {}
