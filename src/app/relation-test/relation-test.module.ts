import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RelationTestPageRoutingModule } from './relation-test-routing.module';

import { RelationTestPage } from './relation-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RelationTestPageRoutingModule
  ],
  declarations: [RelationTestPage]
})
export class RelationTestPageModule {}
