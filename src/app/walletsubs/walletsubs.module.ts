import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletsubsPageRoutingModule } from './walletsubs-routing.module';

import { WalletsubsPage } from './walletsubs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletsubsPageRoutingModule
  ],
  declarations: [WalletsubsPage]
})
export class WalletsubsPageModule {}
