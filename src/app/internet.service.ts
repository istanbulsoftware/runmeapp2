import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InternetService {

  internetStatus = new BehaviorSubject(false);

  constructor(
  ) 
  {

    this.check();


  }


    check(){



    }

    getNetworkState(){
      return this.internetStatus.asObservable();
    }

}
