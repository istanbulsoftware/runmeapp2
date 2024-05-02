import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rev'
})
export class RevPipe implements PipeTransform {

  transform(data: any[]): any[] {

    return data.reverse();
  }

}
