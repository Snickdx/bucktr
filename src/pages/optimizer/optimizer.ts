import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { ResultsPage } from '../results/results';


@Component({
  selector: 'page-optimizer',
  templateUrl: 'optimizer.html'
})
export class OptimizerPage {



  model = {
    outlet : undefined,
    chicken_count: 0,
    side_count: 0,
    drink_count: 0,
    popcorn_count: 0,
    sandwich_count: 0
  };

  change(){
    this.navCtrl.setRoot(OptimizerPage, {outlet: this.model.outlet});
  }


  constructor(public navCtrl: NavController, public navParams:NavParams, public nav:NavController) {
    this.model.outlet = this.navParams.get('outlet');

  }

  increment(key){
    if(this.model[key] < 20)this.model[key]++;
  }

  decrement(key){
    if(this.model[key] > 0)this.model[key]--;
  }


  goToResults(){
      this.navCtrl.push(ResultsPage, this.model);
  }


}
