import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LanguageService } from '../language.service';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();

import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';
const TOKEN_KEY = 'my-token';
@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  styleUrls: ['./languages.page.scss'],
})
export class LanguagesPage implements OnInit {

  langs=[]
  myId
  form: FormGroup

  constructor(
    private trans: LanguageService,
    private translateService: TranslateService,
    private router: Router,
    private socket: Socket,
    private http: HttpClient,

  ) { 
    Preferences.get({ key: TOKEN_KEY }).then(token => {
      if (token && token.value) {
        const a = helper.decodeToken(token.value);
        this.myId = a.id
      }
    })
    this.langs = this.trans.getLanguages();

    this.form = new FormGroup({
      selectedLang: new FormControl(null,{
        updateOn:'change',
        validators: [Validators.required]
      })
    });

    const lang = this.translateService.currentLang;
    this.form.controls.selectedLang.setValue(lang);




    this.socket.on('gelencevap', (data) => {
      console.log(data);
    })


  }

  get selectedLang(){return this.form.get('selectedLang');}


  ngOnInit() {
  }

  save(){
    this.trans.setLanguage(this.form.value.selectedLang);
    this.router.navigateByUrl('/tabs/tab5')
    this.http.post(`${environment.url}/senttest`, { testdata : 'sentdata', senderId: this.myId }).subscribe(
      (res: any) => {
        console.log(res)
      },
      (err) => { 
        console.log(err)
       }
      )
  }

}
