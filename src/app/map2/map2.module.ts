import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Map2PageRoutingModule } from './map2-routing.module';

import { Map2Page } from './map2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Map2PageRoutingModule
  ],
  declarations: [Map2Page]
})
export class Map2PageModule {}
