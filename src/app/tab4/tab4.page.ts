import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  userlist : any
  constructor(
    private http : HttpClient
  ) {
    this.userLists()
   }

  ngOnInit() {
  }
  userLists() {
    
    this.http.get(`${environment.url}/my-lists`).subscribe(
      (res: any) => {
        console.log(res);
        
        this.userlist = res.list


      },
      (err) => {  }
    )
  }
}
