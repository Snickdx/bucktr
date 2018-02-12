import { Component } from '@angular/core';
import {NavParams} from 'ionic-angular';
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

  constructor(public navParams: NavParams, private optimizer:OptimizerProvider) {
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
      });
  }



}
