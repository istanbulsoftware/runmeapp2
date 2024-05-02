import { Injectable } from '@angular/core';

export class location{
  text:string;
  lat:number;
  long:number;
}
@Injectable({
  providedIn: 'root'
})
export class MapServiceService {
  startAddress:location;
  endAddress:location;
  constructor() { }
}
