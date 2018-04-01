import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavParams} from 'ionic-angular';
import {SworkerProvider} from "../../../providers/sworker/sworker";
import {MizerProvider} from "../../../providers/mizer/mizer";


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
    private sw:SworkerProvider
  ) {

    this.order = this.optimizer.parseParams(this.navParams.data);
    if(this.sw.getNetworkState())
      this.menumize();
    else{

    }
  }

  expandItem(item)
  {
    for(let combo in this.mizer){
      if(combo == item)this.mizer[combo].expanded= !this.mizer[combo].expanded;
      else this.mizer[combo].expanded= false;
    }
  }

  menumize = async ()=>
  {

    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Optimizing...'
    });
    loading.present();
    const result = await this.optimizer.run(this.order, "kfc");
    this.mizer = result.mizer;
    this.price = result.price;
    this.totals = result.totals;
    this.menu = Object.keys(result.mizer);
    loading.dismiss();
    this.isLoadingFinished = true;

  }


}
