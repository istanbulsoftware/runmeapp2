import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PicklocationPageRoutingModule } from './picklocation-routing.module';

import { PicklocationPage } from './picklocation.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    PicklocationPageRoutingModule
  ],
  declarations: [PicklocationPage]
})
export class PicklocationPageModule {}
