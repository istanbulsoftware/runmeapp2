import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompetitionsPageRoutingModule } from './competitions-routing.module';

import { CompetitionsPage } from './competitions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompetitionsPageRoutingModule
  ],
  declarations: [CompetitionsPage]
})
export class CompetitionsPageModule {}
