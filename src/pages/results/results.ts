import { Component } from '@angular/core';
import {LoadingController, NavParams} from 'ionic-angular';
import {OptimizerProvider} from "../../providers/optimizer/optimizer";


@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: [OptimizerProvider]
})
export class ResultsPage {
  shareable  = false;
  result={
    optimal_deal:{},
    trans_info:{}
  };
  menu=[];
  price;
  order={
    chicken_amount: parseInt(this.navParams.get('chicken_amount')),
    side_amount: parseInt(this.navParams.get('side_amount')),
    drink_amount: parseInt(this.navParams.get('drink_amount')),
    popcorn_amount: parseInt(this.navParams.get('popcorn_amount')),
    sandwich_amount: parseInt(this.navParams.get('sandwich_amount'))
  };
  totals={
    chicken_amount: 0,
    side_amount: 0,
    drink_amount: 0,
    popcorn_amount: 0,
    sandwich_amount: 0
  };
  newVariable: any;
  loadingFinished = false;

  constructor(public navParams: NavParams, private optimizer:OptimizerProvider, loadingCtrl:LoadingController) {


    this.newVariable = window.navigator;

    if (this.newVariable && this.newVariable.share) {
      this.shareable = true;
    }

    let loading = loadingCtrl.create({
      spinner: 'crescent',
      content: 'Optimizing...'
    });
    loading.present();
    this.optimizer.sendOrder(this.order, this.navParams.get("outlet"))
      .subscribe(res=>{
        this.result = res;
        this.menu = Object.keys(res.optimal_deal);
        this.menu.forEach(key=>{
          this.totals.chicken_amount+=this.result.optimal_deal[key].count * this.result.optimal_deal[key].chicken_count;
          this.totals.side_amount+=this.result.optimal_deal[key].count * this.result.optimal_deal[key].side_count;
          this.totals.drink_amount+=this.result.optimal_deal[key].count * this.result.optimal_deal[key].drink_count;
          this.totals.popcorn_amount+=this.result.optimal_deal[key].count * this.result.optimal_deal[key].popcorn_count;
          this.totals.sandwich_amount+=this.result.optimal_deal[key].count * this.result.optimal_deal[key].sandwich_count;
        });

        this.price = res.trans_info.price;
        this.loadingFinished = true;
        loading.dismiss();
      }, error=>{
        this.loadingFinished = true;
        loading.dismiss();
      });
  }

  share(){

    this.newVariable.share({
      title: 'Menumizer',
      text: `Take a look at my Mizer for ${this.navParams.get("outlet")} I pay only $${this.price}`,
      url: `https://app.menumizer.com/#/results/${this.navParams.get("outlet")}/${this.order.chicken_amount}/${this.order.side_amount}/${this.order.drink_amount}/${this.order.popcorn_amount}/${this.order.sandwich_amount}`,
    })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    }

}
