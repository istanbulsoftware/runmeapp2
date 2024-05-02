import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountTypePageRoutingModule } from './account-type-routing.module';

import { AccountTypePage } from './account-type.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    AccountTypePageRoutingModule
  ],
  declarations: [AccountTypePage]
})
export class AccountTypePageModule {}
