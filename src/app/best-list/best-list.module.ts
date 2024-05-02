import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BestListPageRoutingModule } from './best-list-routing.module';

import { BestListPage } from './best-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BestListPageRoutingModule
  ],
  declarations: [BestListPage]
})
export class BestListPageModule {}
