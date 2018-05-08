import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ConfigProvider} from "../../providers/config/config";
import {KfcOpPage} from "../optimizer/kfc/kfcOptimizer";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {


  constructor(public navCtrl: NavController, public navParams: NavParams, public config:ConfigProvider) {

  }



  change(outlet){
    this.config.changeRestaurant(outlet);
    switch(outlet){
      case "kfc": this.navCtrl.setRoot(KfcOpPage);
        break;
    }

  }

}
