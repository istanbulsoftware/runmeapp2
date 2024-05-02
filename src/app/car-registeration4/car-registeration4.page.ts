import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-car-registeration4',
  templateUrl: './car-registeration4.page.html',
  styleUrls: ['./car-registeration4.page.scss'],
})
export class CarRegisteration4Page implements OnInit {
categories : any
selectedCat : string
selectedMark : string

  constructor(
    public http : HttpClient,
    private activatedRoute : ActivatedRoute
  ) {
    this.selectedCat = this.activatedRoute.snapshot.params['cat']
    this.listSub(this.selectedCat)
  }

  ngOnInit() {
  }
  selectMark(id){
    this.selectedMark = id
  }
  listSub(id) {
    this.http.get(`${environment.url}/list-sub/${id}`).subscribe(
      (res: any) => {
        console.log(res);
        
        this.categories = res.category

      }
    )
  }
}
