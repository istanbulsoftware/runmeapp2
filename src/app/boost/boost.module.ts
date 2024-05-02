import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoostPageRoutingModule } from './boost-routing.module';

import { BoostPage } from './boost.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoostPageRoutingModule
  ],
  declarations: [BoostPage]
})
export class BoostPageModule {}
