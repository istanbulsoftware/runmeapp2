import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletcoinPageRoutingModule } from './walletcoin-routing.module';

import { WalletcoinPage } from './walletcoin.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    WalletcoinPageRoutingModule,
  ],
  declarations: [WalletcoinPage]
})
export class WalletcoinPageModule {}
