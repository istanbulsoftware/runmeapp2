import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvertPrivatePageRoutingModule } from './advert-private-routing.module';

import { AdvertPrivatePage } from './advert-private.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    AdvertPrivatePageRoutingModule
  ],
  declarations: [AdvertPrivatePage]
})
export class AdvertPrivatePageModule {}
