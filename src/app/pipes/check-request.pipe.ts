import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkRequest'
})
export class CheckRequestPipe implements PipeTransform {

  transform(type: string, req: {}): string {
    return req[type];
  }

}
