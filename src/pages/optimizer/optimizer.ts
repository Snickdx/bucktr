import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import { ResultsPage } from '../results/results';
import {SworkerProvider} from "../../providers/sworker/sworker";
import {HomePage} from "../home/home";


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


  constructor(public navCtrl: NavController, public navParams:NavParams, public sw:SworkerProvider, public alertCtrl: AlertController, public nav:NavController) {
    this.model.outlet = this.navParams.get('outlet');

  }

  increment(key){
    if(this.model[key] < 20)this.model[key]++;
  }

  decrement(key){
    if(this.model[key] > 0)this.model[key]--;
  }


  goToResults(){
    if(this.sw.getNetworkState())
      this.navCtrl.push(ResultsPage, this.model);
    else{
      let alert = this.alertCtrl.create({
        title: 'App is offline',
        message: 'You are offline. Should Menumizer remember and notify you when its ready? (You will need to grant notification permission)',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              this.navCtrl.setRoot(HomePage, this.model);
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.navCtrl.setRoot(HomePage, this.model);
            }
          }
        ]
      });

      alert.present();
    }
  }


}
