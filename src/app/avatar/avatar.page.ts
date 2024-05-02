import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
const helper = new JwtHelperService();
const TOKEN_KEY = 'my-token';
import { Preferences } from '@capacitor/preferences';
import { IconsService } from '../icons.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.page.html',
  styleUrls: ['./avatar.page.scss'],
})
export class AvatarPage implements OnInit {
  avatarcount: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
  blockedUsers = []
  myId
  constructor(private http: HttpClient, private toastController: ToastController, 
    public loadingCtrl: LoadingController,
    private router : Router,
    private userSer: IconsService,  

    private actionSheetController: ActionSheetController) {
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const d = helper.decodeToken(token.value);
        this.myId = d.id;
        console.log(this.myId);

        this.syncBlockedUsers()
      }
    })
  }

  ngOnInit() {
  }
  getAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }

  syncBlockedUsers() {
    this.http.get(`${environment.url}/my-blocked-users`).subscribe(
      (res: any) => {
        console.log(res);

        this.blockedUsers = res.blockedUsers;
      },
      (err) => { this.presentToast(err.message) }
    )
  }

  changeUser(user2) {
    this.presentActionSheet(user2);
  }

  async presentToast(m: string) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }

 async changeAvatar(avatar){
    const loading = await this.loadingCtrl.create();
    await loading.present();
  this.http.post(`${environment.url}/change-avatar`, { avatar: avatar }).subscribe(async () => {
      this.userSer.syncToken();

      this.presentToast("Başarılı")
      await loading.dismiss().then(() => { this.router.navigateByUrl('/tab5') })

    },
    (err) => { this.presentToast("Hata oluştu") }
  )
}

  async presentActionSheet(user2) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: "Engeli kaldır",
          icon: 'checkmark-circle',
          handler: () => {
            this.http.post(`${environment.url}/remove-blocked-user`, { user2: user2 }).subscribe(
              (res: any) => {
                this.syncBlockedUsers()
                this.presentToast("Başarılı")
              },
              (err) => { this.presentToast("Hata oluştu") }
            )
          }

        }
      ]
    });

    await actionSheet.present();
  }

}
