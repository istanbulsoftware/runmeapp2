import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarRegisterationPageRoutingModule } from './car-registeration-routing.module';

import { CarRegisterationPage } from './car-registeration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarRegisterationPageRoutingModule
  ],
  declarations: [CarRegisterationPage]
})
export class CarRegisterationPageModule {}
