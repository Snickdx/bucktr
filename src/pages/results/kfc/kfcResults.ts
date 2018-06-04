import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SworkerProvider} from "../../../providers/sworker/sworker";
import {MizerProvider} from "../../../providers/mizer/mizer";
import {RecentPage} from "../../recent/recent";
import {KfcOpPage} from "../../optimizer/kfc/kfcOptimizer";


@IonicPage()
@Component({
  selector: 'page-kfc',
  templateUrl: 'kfcResults.html',
})
export class KfcPage {

  totals;
  mizer;
  menu;
  isLoadingFinished = false;
  price;
  order;


  constructor(
    private navParams: NavParams,
    private optimizer:MizerProvider,
    private loadingCtrl:LoadingController,
    private sw:SworkerProvider,
    private navCtrl:NavController,
    private alertCtrl:AlertController
  ) {

    this.order = this.optimizer.parseParams(this.navParams.data);
    if(this.sw.isOnline())
      this.menumize();
    else{
      this.menumize();
    }
  }

  expandItem(item)
  {
    for(let combo in this.mizer){
      if(combo == item)this.mizer[combo].expanded= !this.mizer[combo].expanded;
      else this.mizer[combo].expanded= false;
    }
  }

  public offlineRedirect()
  {
    this.alertCtrl.create({
      title: 'App is offline',
      message: "Oops looks like you're offline and this is a new mizer. Would you like menumizer to try again in the background and notify when ready? Requires Notification Permission",
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.navCtrl.setRoot(RecentPage);
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.sw.requestNotificationPermission();
            this.optimizer.runOffline(this.order, "kfc");
            this.navCtrl.setRoot(KfcOpPage);
          }
        }
      ]
    }).present();
  }

  menumize = async ()=>
  {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Optimizing...'
    });
    await loading.present();
    const result = await this.optimizer.run(this.order, "kfc");
    if(result === null){
      this.offlineRedirect();
    }else{
      this.mizer = result.mizer;
      this.price = result.price;
      this.totals = result.totals;
      this.menu = Object.keys(result.mizer);
      this.isLoadingFinished = true;
    }
    await loading.dismiss();
  }


}
