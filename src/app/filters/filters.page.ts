import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
})
export class FiltersPage implements OnInit {
  selected:number=0;
  selected1:number=0;
  constructor() { }

  ngOnInit() {
  }
  closeFilter(){
  }

}
