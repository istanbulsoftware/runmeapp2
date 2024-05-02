import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TruecoinPageRoutingModule } from './truecoin-routing.module';

import { TruecoinPage } from './truecoin.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    TruecoinPageRoutingModule
  ],
  declarations: [TruecoinPage]
})
export class TruecoinPageModule {}
