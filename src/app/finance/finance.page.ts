import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
})
export class FinancePage implements OnInit {

  constructor(
    private localizasyion : Location
  ) { }

  ngOnInit() {
  }
goBack(){
  this.localizasyion.back()
}
}
