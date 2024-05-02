import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MylistsPageRoutingModule } from './mylists-routing.module';

import { MylistsPage } from './mylists.page';
import { PipesModule } from '../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PipesModule,
    MylistsPageRoutingModule
  ],
  declarations: [MylistsPage]
})
export class MylistsPageModule {}
