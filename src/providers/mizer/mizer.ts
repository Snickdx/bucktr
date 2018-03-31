import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ErrorObservable} from "rxjs/observable/ErrorObservable";
import {catchError} from "rxjs/operators";
import {environment} from "../../app/environment";
import {AlertController, LoadingController} from "ionic-angular";
import {SworkerProvider} from "../sworker/sworker";

@Injectable()
export class MizerProvider {

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

  public async sendOrder(order, outlet)
  {

    let options = outlet+"/";

    for(let key in order){
      options+= order[key]+"/";
    }

    let subscription = this.http.get(
      environment.backend+options,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
      );

    subscription.pipe(
      catchError(MizerProvider.handleError)
    );

    let data = Object.assign(await subscription.toPromise());


    return data;

  }

}
