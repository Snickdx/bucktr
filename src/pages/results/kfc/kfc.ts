import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SworkerProvider} from "../../../providers/sworker/sworker";
import {MizerProvider} from "../../../providers/mizer/mizer";
import {HomePage} from "../../home/home";


@IonicPage()
@Component({
  selector: 'page-kfc',
  templateUrl: 'kfc.html',
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
      message: "Oops looks like you're offline and you haven't run this mizer before, please try again when networking is available :).",
      buttons: [
        // {
        //   text: 'No',
        //   role: 'cancel',
        //   handler: () => {
        //     this.navCtrl.setRoot(HomePage);
        //   }
        // },
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
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
    loading.present();
    const result = await this.optimizer.run(this.order, "kfc");
    if(result === null){
      loading.dismiss();
      this.offlineRedirect();
    }else{
      this.mizer = result.mizer;
      this.price = result.price;
      this.totals = result.totals;
      this.menu = Object.keys(result.mizer);
      this.isLoadingFinished = true;
      loading.dismiss();
    }
  }


}
