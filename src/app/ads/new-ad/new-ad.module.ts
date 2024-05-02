import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewAdPageRoutingModule } from './new-ad-routing.module';

import { NewAdPage } from './new-ad.page';
import { TranslateModule } from '@ngx-translate/core';
import { MapComponent } from './map/map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    NewAdPageRoutingModule
  ],
  declarations: [NewAdPage, MapComponent]
})
export class NewAdPageModule {}
