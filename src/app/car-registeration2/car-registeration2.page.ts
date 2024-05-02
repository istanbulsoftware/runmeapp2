import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-car-registeration2',
  templateUrl: './car-registeration2.page.html',
  styleUrls: ['./car-registeration2.page.scss'],
})
export class CarRegisteration2Page implements OnInit {
categories : any
selectedCat : string
  constructor(
    public http : HttpClient
  ) { 
    this.listMain()
  }

  ngOnInit() {
  }
  selectCat(id){
    this.selectedCat = id
  }
  listMain() {
    this.http.get(`${environment.url}/list-main`).subscribe(
      (res: any) => {
        console.log(res);
        
        this.categories = res.category

      }
    )
  }
}
