import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();

import { ActivatedRoute, Router } from '@angular/router';

import { Preferences } from '@capacitor/preferences';
const TOKEN_KEY = 'my-token';
import * as moment from 'moment';
@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage   {
id : string
detail : any
  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute : ActivatedRoute
  ) { 
    this.id = this.activatedRoute.snapshot.params['id']
    this.pagedetail(this.id)
  }

  ngOnInit() {
    
  }
  pagedetail(id){
    this.http.get(`${environment.url}/admin-page-detail/${id}`).subscribe(
      (res: any) => {
        console.log(res);
        
          this.detail = res.category[0]

      }
    )
  }
}
