import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'busCat'
})
export class BusCatPipe implements PipeTransform {
  constructor(private trans: TranslateService){}
  transform(m: string): string {
    if(
      m == "bakery"
      || m == "bar"
      || m == "barber"
      || m == "cafe"
      || m == "carRepair"
      || m == "carStore"
      || m == "carService"
      || m == "fastFood"
      || m == "gym"
      || m == "hotel"
      || m == "pastry"
      || m == "pharmacy"
      || m == "restaurant"
      || m == "store"
      || m == "taxi"
    ){
      return this.trans.instant( 'EDIT_PROFILE.' + m );
    }
    else{ return m }
  }

}
