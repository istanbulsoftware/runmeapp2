import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarRegisteration5PageRoutingModule } from './car-registeration5-routing.module';

import { CarRegisteration5Page } from './car-registeration5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarRegisteration5PageRoutingModule
  ],
  declarations: [CarRegisteration5Page]
})
export class CarRegisteration5PageModule {}
