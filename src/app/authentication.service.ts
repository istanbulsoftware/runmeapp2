import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';

import { JwtHelperService } from "@auth0/angular-jwt";
 
const helper = new JwtHelperService();

import { environment } from './../environments/environment'
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { IconsService } from './icons.service';

import { Socket } from 'ngx-socket-io';
import { FcmService } from './fcm.service';
import { AlertController, ToastController } from '@ionic/angular';

import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
const TOKEN_KEY = 'my-token';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url = environment.url
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  isVerified: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(
    private http: HttpClient, 
    private device: Device, 
    private userSer: IconsService,
    private socket: Socket,
    private fcm: FcmService,
    private toastController: ToastController,
    private trans : TranslateService,
    private router : Router,
    private alertCtrl : AlertController
    ) {
    this.loadToken();
  
  }
 
  async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });    
    if (token && token.value) {
      try {
        this.token = token.value;
        this.isAuthenticated.next(true);
        const decodedToken = helper.decodeToken(token.value);
        if(decodedToken.isVerified){this.isVerified.next(true)}
        if(!decodedToken.isVerified){this.isVerified.next(false)}

      } catch (error) {
        this.logout()
        
      }
      
      
    } else {
      this.isAuthenticated.next(false);
    }
  }


  testToken(): Observable<any>{
    return this.http.get(`${this.url}/testToken`)
  }
 
  login(credentials: {email, password}): Observable<any> {
    return this.http.post(`${this.url}/login`, {
      email: credentials.email,
      password: credentials.password,
      deviceData: {type: `${this.device.manufacturer},  ${this.device.model}`, os: `${this.device.platform},  ${this.device.version}`, uuid:this.device.uuid, serial: this.device.serial}

    }).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        const decodedToken = helper.decodeToken(token);
        if(decodedToken.isVerified){this.isVerified.next(true)}
        if(!decodedToken.isVerified){this.isVerified.next(false)}
        return from(Preferences.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.fcm.initPush(this.device.uuid);
        this.isAuthenticated.next(true);
        this.userSer.syncToken();
      })
    )
  }
 async presentAlert(m){
    const alert = await this.alertCtrl.create({
      header: this.trans.instant('ALERTS.LOGIN.loginFailed'),
      message: m,
      buttons: ['OK'],
    });
    await alert.present();
  }
  verifyEmail(code:number): Observable<any>{
    return this.http.post(`${this.url}/verifyEmail`, {code: code.toString()}).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        const decodedToken = helper.decodeToken(token);
        if(decodedToken.isVerified){this.isVerified.next(true)}
        if(!decodedToken.isVerified){this.isVerified.next(false)}
        return from(Preferences.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
    
  }
 
  editProfile(data: {name, bio, city, mobile, birthday, businessCategory, gender, idnumber, bllodgroup}): Observable<any>{
    console.log(data);
    
    return this.http.post(`${this.url}/edit-profile`, data).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Preferences.set({key: TOKEN_KEY, value: token}));
      })
    )
  }
  removeProfileImage(): Observable<any>{
    return this.http.get(`${this.url}/remove-profile-photo`).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Preferences.set({key: TOKEN_KEY, value: token}));
      })
    )
    
  }
  changeProfileImage(a): Observable<any>{
    return this.http.get(`${this.url}/change-profile-photo/${a}`).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Preferences.set({key: TOKEN_KEY, value: token}));
      })
    )
    
  }

  resendCode(): Observable<any>{
    return this.http.get(`${this.url}/resendCode`)
  }

  changeEmailCode(email:string): Observable<any>{
    return this.http.post(`${this.url}/changeEmailCode`,{newEmail: email})
  }
  changeUserToken(usertoken:string, coins : any): Observable<any>{
    return this.http.post(`${this.url}/changeUserToken`,{usertoken: usertoken, quantity : coins})
  }
  changeEmail(data:{email:string, code:number}): Observable<any>{
    return this.http.post(`${this.url}/edit-email`,{newEmail: data.email, code: data.code.toString()})
    .pipe(
      map((data: any) => data.token),
      switchMap(token => {
        const decodedToken = helper.decodeToken(token);
        if(decodedToken.isVerified){this.isVerified.next(true)}
        if(!decodedToken.isVerified){this.isVerified.next(false)}
        return from(Preferences.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  changePassword(oldPass:string, newPass:string): Observable<any>{
    return this.http.post(`${this.url}/changePassword`,{oldPassword: oldPass, newPassword: newPass})
  }
  
  passwordResetCode(email:string): Observable<any>{
    return this.http.post(`${this.url}/passwordResetCode`,{email: email})
  }

  resetPassword(data:{email:string, code:number, password:string}): Observable<any>{
    return this.http.post(`${this.url}/resetPassword`,{email: data.email, code: data.code.toString(), password: data.password})
  }

  


  signup(credentials: {accountType, name, email, password, mobile, surname, birthday, gender, businessCategory, city}): Observable<any> {
    return this.http.post(`${this.url}/signup`, {
      accountType: credentials.accountType,
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      birthday: credentials.birthday,
      mobile: credentials.mobile,
      surname: credentials.surname,
      gender: credentials.gender,
      city: credentials.city,
      businessCategory: credentials.businessCategory,
      deviceData: {type: `${this.device.manufacturer},  ${this.device.model}`, os: `${this.device.platform},  ${this.device.version}`, uuid:this.device.uuid, serial: this.device.serial}

    }).pipe(
      map((data: any) => {
        if (data.status == 201) {
          Preferences.set({key: "edit", value: "1"})
          console.log('login auto')
        }
      }),
      
    )
  }
 
 
  async logout(): Promise<any> {
    this.isAuthenticated.next(false);
    return Preferences.remove({key: TOKEN_KEY}).then(a=>{
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return true
    })
}


  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }
}
