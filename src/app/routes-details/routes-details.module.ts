import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutesDetailsPageRoutingModule } from './routes-details-routing.module';

import { RoutesDetailsPage } from './routes-details.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    RoutesDetailsPageRoutingModule
  ],
  declarations: [RoutesDetailsPage]
})
export class RoutesDetailsPageModule {}
