import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailVerificationPageRoutingModule } from './email-verification-routing.module';
import { NgOtpInputModule } from 'ng-otp-input';

import { EmailVerificationPage } from './email-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    EmailVerificationPageRoutingModule
  ],
  declarations: [EmailVerificationPage]
})
export class EmailVerificationPageModule {}
