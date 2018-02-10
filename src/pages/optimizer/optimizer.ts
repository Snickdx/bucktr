import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ResultsPage } from '../results/results';


@Component({
  selector: 'page-optimizer',
  templateUrl: 'optimizer.html'
})
export class OptimizerPage {

  model = {
    chicken_amount: 5,
    side_amount: 5,
    drink_amount: 5
  };

  constructor(public navCtrl: NavController) {

  }

  goToResults(){
    this.navCtrl.push(ResultsPage, this.model);
  }


}
