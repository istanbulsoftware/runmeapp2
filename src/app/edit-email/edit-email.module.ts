import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditEmailPageRoutingModule } from './edit-email-routing.module';

import { EditEmailPage } from './edit-email.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    EditEmailPageRoutingModule
  ],
  declarations: [EditEmailPage]
})
export class EditEmailPageModule {}
