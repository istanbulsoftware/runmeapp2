import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationSettingsPageRoutingModule } from './location-settings-routing.module';

import { LocationSettingsPage } from './location-settings.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    LocationSettingsPageRoutingModule
  ],
  declarations: [LocationSettingsPage],
})
export class LocationSettingsPageModule {}
