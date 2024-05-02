import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'glob'
})
export class GlobPipe implements PipeTransform {

  transform(date: string): string {
    const now = new Date(Date.now());
    const xDate = new Date(date);
    
    const offset = now.getTimezoneOffset()*60000;
    const localDate = new Date(xDate.getTime() - offset);
    return localDate.toISOString();
  }

}
