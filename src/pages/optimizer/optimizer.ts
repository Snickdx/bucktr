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
    chicken_amount: 0,
    side_amount: 0,
    drink_amount: 0,
    popcorn_amount: 0,
    sandwich_amount: 0
  };

  change(){
    this.navCtrl.setRoot(OptimizerPage, {outlet: this.model.outlet});
  }


  constructor(public navCtrl: NavController, public navParams:NavParams) {
    this.model.outlet = this.navParams.get('outlet');
  }

  increment(key){
    this.model[key]++;
  }

  decrement(key){
    if(this.model[key] > 0)this.model[key]--;
  }


  goToResults(){
    console.log(this.model);
    this.navCtrl.push(ResultsPage, this.model);
  }


}
