import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarRegisteration3PageRoutingModule } from './car-registeration3-routing.module';

import { CarRegisteration3Page } from './car-registeration3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarRegisteration3PageRoutingModule
  ],
  declarations: [CarRegisteration3Page]
})
export class CarRegisteration3PageModule {}
