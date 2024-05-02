import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'askall'
})
export class AskallPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
