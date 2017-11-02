import { Component } from '@angular/core';
import { Loading, NavController, ModalController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Md5 } from "ts-md5/dist/md5";
import { Storage } from '@ionic/storage';
import { AppGlobal } from '../../app/app.global';

import { Page7 } from '../page_7/page_7';
import { Page9 } from '../page_9/page_9';

@Component({
  selector: 'page-2',
  templateUrl: 'page_2.html'
})
export class Page2 {

  loading: Loading;
  qx: any = { lower: 1, upper: 24 };
  je: any = { lower: 1000, upper: 50000 };
  loan: any = [];
  page: number = 1;
  tempTimes = 1;
  noMoreData = false;
  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    private http: Http,
    public loadingCtrl: LoadingController,
    private storage: Storage
  ) {}

  ionViewDidLoad() {
    this.showLoading();
    this.doRefresh('');
  }

  showLoading() {
    if(!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: '请稍后...',
        dismissOnPageChange: true,
        spinner: 'crescent'
      });
      this.loading.present();
    }
  }

  dismissLoading() {
    if(this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  getLoan(e) {
    let code = '9561e4a736e89d89';
    let date: any = new Date();
    let now: any = Date.parse(date) / 1000;
    let param = {
      auth: Md5.hashStr('api_' + code + now),
      authTime: now,
      page: this.page,
      minDate: this.qx.lower,
		  maxDate: this.qx.upper,
		  minpay: this.je.lower,
		  maxpay: this.je.upper
    }
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers })
    
    this.http.post(AppGlobal.getInstance().rootUrl + '?c=loan&m=search', param, options)
    .toPromise()
    .then(res => {
      if(this.page == 1) {
        this.loan = res.json().data.list;
      }else if(this.page < res.json().data.pageCount) {
        this.loan = this.loan.concat(res.json().data.list);
      }else {
        if(this.tempTimes < 2) {
          this.loan = this.loan.concat(res.json().data.list);
        }
        this.tempTimes++;
        this.page = res.json().data.pageCount;
        this.noMoreData = true;
      }
      this.dismissLoading();
      if(e) e.complete();
    })
    .catch(error => {
      console.log('访问以上地址时出现了一个异常：');
      console.log(error)
      this.dismissLoading();
      if(e) e.complete();
    });
  }

  doRefresh(refresher) {
    this.page = 1;
    this.tempTimes = 1;
    this.noMoreData = false;
    this.getLoan(refresher);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.getLoan(infiniteScroll);
  }

  goToPage7() {
    let modal = this.modalCtrl.create(Page7);
    modal.present();
  }
  goToPage9() {
    this.navCtrl.push(Page9)
  }

  getDetails(data, page) {
    this.storage.set('data', data);
    switch(page) {
      case 9:
        this.goToPage9();
        break;
    }
  }

}