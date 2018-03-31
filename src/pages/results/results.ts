import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MizerProvider} from "../../providers/mizer/mizer";
import {HomePage} from "../home/home";
import {SworkerProvider} from "../../providers/sworker/sworker";


@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: [MizerProvider]
})
export class ResultsPage {
  isShareable       = false;
  mizer             = {};
  menu              = [];
  _window:any       = window.navigator;
  isLoadingFinished = false;
  price;
  order;

  totals={
    chicken_count: 0,
    side_count: 0,
    drink_count: 0,
    popcorn_count: 0,
    sandwich_count: 0
  };

  constructor(
    private navParams: NavParams,
    private optimizer:MizerProvider,
    private navCtrl: NavController,
    private loadingCtrl:LoadingController,
    private sw:SworkerProvider,
    private alertCtrl: AlertController
  ) {

    this.order = this.optimizer.parseParams(this.navParams.data);
    this.isShareable = this._window && this._window.share;

    if(this.sw.getNetworkState())
      this.menumize();
    else{

    }
  }

  share()
  {
    this._window.share({
        title: 'Menumizer',
        text: `Take a look at my Mizer for ${this.navParams.get("outlet")} I pay only $${this.price}`,
        url: `
        https://app.menumizer.com/#/results/
        ${this.navParams.get("outlet")}/
        ${this.order['chicken_count']}/
        ${this.order['side_count']}/
        ${this.order['drink_count']}/
        ${this.order['popcorn_count']}/
        ${this.order['sandwich_count']}
       `
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  }

  expandItem(item)
  {
    for(let combo in this.mizer){
      if(combo == item)this.mizer[combo].expanded= !this.mizer[combo].expanded;
      else this.mizer[combo].expanded= false;
    }
  }

  offlineModal = ()=>
  {
    this.alertCtrl.create({
      title: 'App is offline',
      message: 'You are offline. Should Menumizer remember and notify you when its ready? (You will need to grant notification permission)',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    }).present();
  };

  menumize = ()=>
  {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Optimizing...'
    });

    loading.present();
    this.optimizer.sendOrder(this.order)
      .subscribe(res=>{
        this.menu = Object.keys(res.optimal_deal);
        this.mizer = res.optimal_deal;
        this.price = res.trans_info.price;

        for(let combo in this.mizer){
          for(let item in this.totals){
            this.totals[item]+=this.mizer[combo].count * this.mizer[combo][item];
          }
          this.mizer[combo].expanded=false;
        }

        this.isLoadingFinished = true;
        loading.dismiss();
      }, error=>{
        this.isLoadingFinished = true;
        loading.dismiss();
      });

  }

}
