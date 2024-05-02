import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WatchAdsPageRoutingModule } from './watch-ads-routing.module';

import { WatchAdsPage } from './watch-ads.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WatchAdsPageRoutingModule
  ],
  declarations: [WatchAdsPage]
})
export class WatchAdsPageModule {}
