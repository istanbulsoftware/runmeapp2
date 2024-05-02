import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetoptPageRoutingModule } from './setopt-routing.module';

import { SetoptPage } from './setopt.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetoptPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [SetoptPage]
})
export class SetoptPageModule {}
