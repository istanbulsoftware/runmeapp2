import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SocialAccountsPageRoutingModule } from './social-accounts-routing.module';

import { SocialAccountsPage } from './social-accounts.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SocialAccountsPageRoutingModule
  ],
  declarations: [SocialAccountsPage]
})
export class SocialAccountsPageModule {}
