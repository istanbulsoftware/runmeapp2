import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarRegisteration4PageRoutingModule } from './car-registeration4-routing.module';

import { CarRegisteration4Page } from './car-registeration4.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    CarRegisteration4PageRoutingModule
  ],
  declarations: [CarRegisteration4Page]
})
export class CarRegisteration4PageModule {}
