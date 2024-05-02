import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { Preferences } from '@capacitor/preferences';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

import { IconsService } from '../icons.service';
import { Location } from '@angular/common';
const TOKEN_KEY = 'my-token';
@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  myId
  user: any = {name:'', profilePicture:{publicPath: null}}
  other = false
  isLoading = true
  isBusiness = false
  constructor(
    private authService: AuthenticationService, 
    private router: Router,  
    private userSer: IconsService,
    private location : Location
    ) {
      Preferences.get({ key: TOKEN_KEY }).then(token => {
        if (token && token.value) {
          const de = helper.decodeToken(token.value);
          this.myId = de.id;
        }
      })
    }
  goBack(){
    this.router.navigateByUrl(`/tabs/my-profile`)
  }
  ngOnInit(){

    this.userSer.getUser().subscribe((user: any)=>{
      if(user && user.email){
        console.log(user);
        
        this.user = user
        if(user.accountType == 'business'){this.isBusiness = true}
        if(
          this.user.businessCategory 
          && this.user.businessCategory != 'restaurant'
          && this.user.businessCategory != 'fastFood'
          && this.user.businessCategory != 'cafe'
          && this.user.businessCategory != 'bakery'
          && this.user.businessCategory != 'pastry'
          && this.user.businessCategory != 'store'
          && this.user.businessCategory != 'hotel'
          && this.user.businessCategory != 'bar'
          && this.user.businessCategory != 'carService'
          && this.user.businessCategory != 'carRepair'
          && this.user.businessCategory != 'carStore'
          && this.user.businessCategory != 'gym'
          && this.user.businessCategory != 'barber'
          && this.user.businessCategory != 'pharmacy'
          && this.user.businessCategory != 'taxi'
          ){
            this.other = true
        }
        this.isLoading = false
      }
      
    })
  
  }

  ionViewWillEnter(){
    this.userSer.syncToken()
    this.userSer.getUser().subscribe((user: any)=>{
    })
  }


  onOpenProfile(){
    this.router.navigateByUrl(`/profile/${this.user.id}`)
  }


  logout() {
    this.authService.logout()
  }


}
