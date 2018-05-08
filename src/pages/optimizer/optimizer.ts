import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {KfcOpPage} from "./kfc/kfcOptimizer";


@Component({
  selector: 'page-optimizer',
  templateUrl: 'optimizer.html'
})
export class OptimizerPage {

  outlet=undefined;


  change(){
    switch(this.outlet){
      case "kfc": this.navCtrl.setRoot(KfcOpPage);
        break;
    }

  }


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.outlet = navParams.get("outlet");
    switch(this.outlet){
      case "kfc": this.navCtrl.setRoot(KfcOpPage);
        break;
    }
  }


}
