import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarRegisteration2PageRoutingModule } from './car-registeration2-routing.module';

import { CarRegisteration2Page } from './car-registeration2.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CarRegisteration2PageRoutingModule
  ],
  declarations: [CarRegisteration2Page]
})
export class CarRegisteration2PageModule {}
