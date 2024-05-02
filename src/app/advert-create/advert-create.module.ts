import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvertCreatePageRoutingModule } from './advert-create-routing.module';

import { AdvertCreatePage } from './advert-create.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    IonicModule,
    AdvertCreatePageRoutingModule
  ],
  declarations: [AdvertCreatePage]
})
export class AdvertCreatePageModule {}
