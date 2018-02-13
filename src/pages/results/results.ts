import { Component } from '@angular/core';
import {LoadingController, NavParams} from 'ionic-angular';
import {OptimizerProvider} from "../../providers/optimizer/optimizer";

// interface Order{
//   chicken_amt: number;
//   side_amt: number;
//   drink_amt;
// }


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
    drink_amount: parseInt(this.navParams.get('drink_amount'))
  };
  totals={
    chicken_amount: 0,
    side_amount: 0,
    drink_amount: 0
  };
  objectKeys = Object.keys;
  newVariable: any;

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
    this.optimizer.sendOrder(this.order)
      .subscribe(res=>{
        this.result = res;
        this.menu = Object.keys(res.optimal_deal);
        this.menu.forEach(key=>{
          this.totals.chicken_amount+=this.result.optimal_deal[key].count * this.result.optimal_deal[key].chicken_count;
          this.totals.side_amount+=this.result.optimal_deal[key].count * this.result.optimal_deal[key].side_count;
          this.totals.drink_amount+=this.result.optimal_deal[key].count * this.result.optimal_deal[key].drink_count;
        });
        console.log(this.order, this.totals);
        this.price = res.trans_info.price;
        loading.dismiss();
      });
  }

  share(){


    this.newVariable.share({
      title: 'Menu Hacker',
      text: "I'm saving money while buying chicken!",
      url: `https://fixmehup.firebaseapp.com/#/results/${this.order.chicken_amount}/${this.order.side_amount}/${this.order.drink_amount}`,
    })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    }


}
