import { NgModule } from '@angular/core';
import { SearchPipe } from './search.pipe';
import { GlobPipe } from './glob.pipe';
import { GenderPipe } from './gender.pipe';
import { BusCatPipe } from './bus-cat.pipe';
import { CheckRequestPipe } from './check-request.pipe';
import { AskallPipe } from './askall.pipe';
import { RevPipe } from './rev.pipe';
import { OrderbyPipe } from './orderby.pipe';

@NgModule({
declarations: [SearchPipe, OrderbyPipe, GlobPipe, GenderPipe, BusCatPipe, CheckRequestPipe, AskallPipe, RevPipe],
imports: [],
exports: [SearchPipe, OrderbyPipe, GlobPipe, GenderPipe, BusCatPipe, CheckRequestPipe,RevPipe],
})

export class PipesModule {}