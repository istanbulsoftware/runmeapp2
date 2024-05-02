import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  constructor(
  private trans : TranslateService
  ){}

  transform(m: string): string {
    if(m == 'male' || m == "female" || m == 'other'){
      return this.trans.instant( 'EDIT_PROFILE.' + m );
    }
    else{
      return m;
    }
    
  }

}
