import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationSetPageRoutingModule } from './location-set-routing.module';

import { LocationSetPage } from './location-set.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationSetPageRoutingModule
  ],
  declarations: [LocationSetPage]
})
export class LocationSetPageModule {}
