import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { ResultsPage } from '../results/results';


@Component({
  selector: 'page-optimizer',
  templateUrl: 'optimizer.html'
})
export class OptimizerPage {

  outlet = this.navParams.get('outlet');

  model = {
    chicken_amount: 0,
    side_amount: 0,
    drink_amount: 0
  };

  doRefresh(refresher) {

    setTimeout(() => {
      location.reload();
      refresher.complete();
    }, 2000);
  }

  constructor(public navCtrl: NavController, public navParams:NavParams) {

  }


  goToResults(){
    this.navCtrl.push(ResultsPage, this.model);
  }


}
