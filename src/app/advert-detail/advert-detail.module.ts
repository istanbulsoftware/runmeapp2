import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { AdvertDetailPageRoutingModule } from './advert-detail-routing.module';

import { AdvertDetailPage } from './advert-detail.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    AdvertDetailPageRoutingModule
  ],
  declarations: [AdvertDetailPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdvertDetailPageModule {}
