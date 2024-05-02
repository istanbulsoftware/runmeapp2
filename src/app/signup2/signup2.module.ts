import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Signup2PageRoutingModule } from './signup2-routing.module';

import { Signup2Page } from './signup2.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    Signup2PageRoutingModule
  ],
  declarations: [Signup2Page]
})
export class Signup2PageModule {}
