import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ErrorObservable} from "rxjs/observable/ErrorObservable";
import {catchError} from "rxjs/operators";
import {environment} from "../../app/environment";
import {AlertController, LoadingController} from "ionic-angular";
import {SworkerProvider} from "../sworker/sworker";


@Injectable()
export class MizerProvider{

  constructor(
    public http: HttpClient,
    public alertCtrl: AlertController,
    public sw: SworkerProvider,
    public loadingCtrl: LoadingController
  )
  { }


  private static handleError(error: HttpErrorResponse)
  {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };

  public parseParams(params)
  {
    return Object.keys(params).reduce((acc, ele)=>{
      acc[ele] = parseInt(params[ele]);
      return acc;
    }, {});
  };

  static getUrlFromOrder(order, outlet)
  {
    let url = environment.backend+outlet+"/";
    for(let key in order){
      url+=order[key]+"/";
    }
    return url;
  }

  static async transformPromise(mizerPromise, order)
  {
    const data = await mizerPromise;

    let result = {
      totals: {},
      price: data.trans_info.price,
      mizer : data.optimal_deal
    };

    for(let combo in result.mizer){
      for(let item in order){
        let acc = result.totals.hasOwnProperty(item) ? result.totals[item] : 0;
        result.totals[item]= acc + result.mizer[combo].count * result.mizer[combo][item];
      }
      result.mizer[combo].expanded = false;
    }

    return result;
  }

  public async run(order, outlet)
  {
    console.log("Optimizer started");

    let url = MizerProvider.getUrlFromOrder(order, outlet);

    let isCached = await SworkerProvider.isCached(url, "mizers");

    console.log(isCached?"This request was cached":"This request was not cached");

    if(isCached || this.sw.isOnline() ){
      const sub = this.http.get(url, {headers: new HttpHeaders({'Content-Type': 'application/json'})});

      sub.pipe(catchError(MizerProvider.handleError));

      return MizerProvider.transformPromise(sub.toPromise(), order);
    }
    return null;
  }


}
