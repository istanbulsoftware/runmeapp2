import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { IconsService } from './icons.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  convs = new BehaviorSubject({})
  myId:string
  constructor(
    private socket: Socket,
    private userSer: IconsService,
  ) { 
    this.userSer.getUser().subscribe((user:any)=>{
     if(user && user.id){
       this.myId = user.id
     } 
    })
  }

  syncConvs(){
    if(this.myId){
      this.socket.emit('getConvs', {id: this.myId});
      this.socket.on(this.myId + '/myConvs', (convs)=>{
        this.convs.next(convs);
      })

    }

  }

  getConvs(){
    return this.convs.asObservable();
  }

}
