import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {KfcPage} from "../../results/kfc/kfc";

export interface kfcOrder {
  chicken_count: number;
  side_count: number,
  drink_count: number,
  popcorn_count: number,
  sandwich_count: number
}

@IonicPage()
@Component({
  selector: 'page-kfc-op',
  templateUrl: 'kfc-op.html',
})
export class KfcOpPage {

  outlet=undefined;

  model = {
    chicken_count: 0,
    side_count: 0,
    drink_count: 0,
    popcorn_count: 0,
    sandwich_count: 0
  };

  // change(){
  //   this.navCtrl.setRoot(OptimizerPage, {outlet: this.outlet});
  // }


  constructor(public navCtrl: NavController, public nav:NavController) {
    this.outlet = "kfc";

  }

  increment(key){
    if(this.model[key] < 20)this.model[key]++;
  }

  decrement(key){
    if(this.model[key] > 0)this.model[key]--;
  }


  goToResults(){
    this.navCtrl.push(KfcPage, this.model);
  }

}
