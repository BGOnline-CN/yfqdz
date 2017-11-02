import { Component } from '@angular/core';
import { Loading, LoadingController, NavController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Md5 } from "ts-md5/dist/md5";
import { Storage } from '@ionic/storage';
import { AppGlobal } from '../../app/app.global';

import { Page9 } from '../page_9/page_9';

@Component({
  selector: 'page-11',
  templateUrl: 'page_11.html'
})
export class Page11 {

  loading: Loading;
  loan: any = [];
  page: number = 1;
  tempTimes = 1; // 记录page和总页数相等的次数
  noMoreData = false;
  loanType: any = {};
  constructor(
    public navCtrl: NavController,
    private http: Http,
    public loadingCtrl: LoadingController,
    private storage: Storage
  ) {}

  ionViewDidLoad() {
    this.showLoading();
    this.storage.get('loanType').then((val) => {
      this.loanType = val;
      this.doRefresh('');
    });
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

  searchLoan(e) {
    let code = '9561e4a736e89d89';
    let date: any = new Date();
    let now: any = Date.parse(date) / 1000;
    let param = {
      auth: Md5.hashStr('api_' + code + now),
      authTime: now,
      page: this.page,
      name: this.loanType.hasOwnProperty('label6') ? null : this.loanType.name,
      label6: this.loanType.label6
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
      // this.dismissLoading();
      if(e) e.complete();
    })
    .catch(error => {
      console.log('访问以上地址时出现了一个异常：');
      console.log(error)
      // this.dismissLoading();
      if(e) e.complete();
    });
  }

  doRefresh(refresher) {
    this.page = 1;
    this.tempTimes = 1;
    this.noMoreData = false;
    this.searchLoan(refresher);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.searchLoan(infiniteScroll);
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
