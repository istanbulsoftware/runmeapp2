import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvertRealPageRoutingModule } from './advert-real-routing.module';

import { AdvertRealPage } from './advert-real.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    AdvertRealPageRoutingModule
  ],
  declarations: [AdvertRealPage]
})
export class AdvertRealPageModule {}
