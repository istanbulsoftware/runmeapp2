import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Plugins } from '@capacitor/core';
const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  requests = new BehaviorSubject(0);
  messages = new BehaviorSubject(0);
  chats = new BehaviorSubject({});
  calls = new BehaviorSubject(0);
  constructor() { }


  numOfMes(){return this.messages.asObservable()}
  numOfReq(){return this.requests.asObservable()}
  numOfCall(){return this.calls.asObservable()}

  increase(convId){
    var a = this.chats.value
    if (a[convId]){
      a[convId].count = a[convId].count + 1;
      this.chats.next(a);
    }
    else{
      a[convId]={count: 1 }
      this.chats.next(a);
    }
  }
  decrease(convId){
    var d = this.chats.value
    const m = this.messages.value
    if (d[convId]){
      const newM = m - d[convId].count;
      if(newM >= 0){ this.messages.next(newM); }
      d[convId].count = 0;
      this.chats.next(d);
    }
  }

  myChats(){ return this.chats.asObservable()}

  async syncData(){
    const list = await PushNotifications.getDeliveredNotifications()
    const a = list.notifications.filter(x => x.data.tag == 'message')
    const b = list.notifications.filter(x => x.data.tag == 'request')
    const c = list.notifications.filter(x => x.data.tag == 'call')

    this.messages.next( this.messages.getValue() + a.length )
    this.requests.next( this.requests.getValue() + b.length )
    this.calls.next( this.calls.getValue() + c.length )
    await PushNotifications.removeAllDeliveredNotifications()
    return true
  }

  async incMes(){
    //await this.syncData();
    this.messages.next( this.messages.getValue() + 1 )
  }
  async incReq(){
    //await this.syncData();
    this.requests.next( this.requests.getValue() + 1 )
  }
  async incCall(){
    //await this.syncData();
    this.calls.next( this.requests.getValue() + 1 )
  }


  resetMes(){
    this.messages.next(0);
  }
  resetReq(){
    this.requests.next(0);
  }
  resetcall(){
    this.requests.next(0);
  }
}
