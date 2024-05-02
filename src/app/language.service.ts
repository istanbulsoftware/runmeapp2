import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';

const LNG_KEY = 'SELECTED_LANGUAGE'

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = ''
  constructor(
    private plt: Platform,
    private translate: TranslateService,
    private http: HttpClient
  ) { } 


  setInitialAppLanguage(){
    let language = this.translate.getBrowserLang();
    
    const langs = this.getLanguages();
    const a = new Promise((resolve,reject)=>{
      loop:for (const i in langs) {
        if (langs[i].value == language) {
          resolve(true);
          break loop
        }
        else if (Number(i) == (langs.length-1)){
          resolve(false);
        }
      }
    });


    Preferences.get({key: LNG_KEY}).then(lang=>{
      if(lang && lang.value){
        console.log(lang,lang.value)
        this.setLanguage(lang.value);
        this.selected = lang.value;
      }else{
        a.then(m=>{
          if(m){
            this.setLanguage(language);
            this.selected = language;
          }
          else{
            this.setLanguage('en');
            this.selected = 'en';
          }
        });
      }
    })
  }

  getLanguage(){
    return this.selected
  }

  setLanguage(lang){
    const a = document.documentElement
    
    this.translate.use(lang);
    this.selected = lang;
    Preferences.set({key: LNG_KEY, value: lang}).then(x=>{
      this.http.post(`${environment.url}/setLanguage`,{lang: lang}).subscribe(
        (res)=>{
          console.log('Language set')
        },
        (err)=>{
          console.log(err)
        }
      )
    })

    if(lang == 'fa' || lang =='ar' || lang =='he'){
      a.dir='rtl';
    }
    else{a.dir='ltr'}
  }

  getLanguages(){
    return [
      {text:'English', value:'en', img: './../assets/flags/en.svg'},
  //    {text:'中文', value:'zh', img: './../assets/flags/zh.svg'},
   //   {text:'हिन्दी', value:'hi', img: './../assets/flags/hi.svg'},
    //  {text:'Español', value:'es', img: './../assets/flags/es.svg'},
    //  {text:'français', value:'fr', img: './../assets/flags/fr.svg'},
    //  {text:'flemish', value:'de', img: './../assets/flags/fl.svg'},
   //   {text:'العربية', value:'ar', img: './../assets/flags/ar.svg'},
    //  {text:'русский', value:'ru', img: './../assets/flags/ru.svg'},
    //  {text:'Português', value:'pt', img: './../assets/flags/pt.svg'},
    //  {text:'Deutsch', value:'de', img: './../assets/flags/de.svg'},
   //   {text:'Italiano', value:'it', img: './../assets/flags/it.svg'},
    //  {text:'suomi', value:'fi', img: './../assets/flags/fi.svg'},
   //   {text:'한국어', value:'ko', img: './../assets/flags/ko.svg'},
        {text:'Türkçe', value:'tr', img: './../assets/flags/tr.svg'},
    //  {text:'azərbaycan', value:'az', img: './../assets/flags/az.svg'},
     // {text:'فارسی', value:'fa', img: './../assets/flags/fa.svg'},
   //   {text:'Kurdi', value:'ku', img: './../assets/flags/ku.png'},
    //  {text:'日本語', value:'ja', img: './../assets/flags/ja.svg'},
   //   {text:'ελληνικά', value:'el', img: './../assets/flags/el.svg'},
   //   {text:'Afrikaans', value:'af', img: './../assets/flags/af.svg'},
   //   {text:'עברית', value:'he', img: './../assets/flags/he.svg'},
    ]
    
  }

}
