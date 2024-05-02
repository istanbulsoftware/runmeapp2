import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Preferences } from '@capacitor/preferences';


const helper = new JwtHelperService();

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  user = new BehaviorSubject({})

  constructor(

  ) { 
    Preferences.get({key: TOKEN_KEY}).then(token=>{
      if(token && token.value){
        this.user.next(helper.decodeToken(token.value))
      }
    }).catch(err=>{
      console.log(err);
    });

  }

  syncToken(){
    Preferences.get({key: TOKEN_KEY}).then(token=>{
      if(token && token.value){
        this.user.next(helper.decodeToken(token.value))
      }
    }).catch(err=>{
      console.log(err);
    });
  }

  getUser(){
    return this.user.asObservable()
  }



}
