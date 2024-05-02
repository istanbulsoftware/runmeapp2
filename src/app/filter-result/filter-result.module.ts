import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterResultPageRoutingModule } from './filter-result-routing.module';

import { FilterResultPage } from './filter-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterResultPageRoutingModule
  ],
  declarations: [FilterResultPage]
})
export class FilterResultPageModule {}
