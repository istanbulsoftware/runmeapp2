import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.page.html',
  styleUrls: ['./search-list.page.scss'],
})
export class SearchListPage implements OnInit {

  constructor(public navCtrl:NavController) { }

  ngOnInit() {
  }
  router(){
    this.navCtrl.navigateForward(['/select-item']);
  }

}
