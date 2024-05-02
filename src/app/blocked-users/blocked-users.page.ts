import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

import { ActionSheetController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
const helper = new JwtHelperService();
import { Preferences } from '@capacitor/preferences';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-blocked-users',
  templateUrl: './blocked-users.page.html',
  styleUrls: ['./blocked-users.page.scss'],
})
export class BlockedUsersPage implements OnInit {
  blockedUsers = []
  myId
  constructor(private http: HttpClient, private toastController: ToastController, private actionSheetController: ActionSheetController, private trans:TranslateService) {
    Preferences.get({key: TOKEN_KEY}).then(token=>{
      if(token && token.value){
        const d = helper.decodeToken(token.value);
        this.myId= d.id;
        this.syncBlockedUsers()
      }
    })
   }

  ngOnInit() {
  }

  syncBlockedUsers(){
    this.http.get(`${environment.url}/my-blocked-users`).subscribe(
      (res:any)=>{
        this.blockedUsers = res.blockedUsers;
      },
      (err)=>{this.presentToast(err.message)}
    )
  }

  changeUser(user2){
    this.presentActionSheet(user2);
  }

  async presentToast(m:string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

  async presentActionSheet(user2) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.trans.instant('BLOCKED_USERS.unblock'),
          icon: 'checkmark-circle',
          handler: () => {
            this.http.post(`${environment.url}/remove-blocked-user`,{user2: user2}).subscribe(
              (res:any)=>{
                this.syncBlockedUsers()
                this.presentToast(this.trans.instant('ALERT.success'));
              },
              (err)=>{this.presentToast(this.trans.instant('ALERT.fail'))}
            )
          }
      
        }
      ]
    });
  
    await actionSheet.present();
  }

}
