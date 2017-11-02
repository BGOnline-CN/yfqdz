import { Component } from '@angular/core';
import { Loading, NavController, ModalController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Md5 } from "ts-md5/dist/md5";
import { Storage } from '@ionic/storage';
import { AppGlobal } from '../../app/app.global';

import { Page7 } from '../page_7/page_7';
import { Page10 } from '../page_10/page_10';

@Component({
  selector: 'page-3',
  templateUrl: 'page_3.html'
})
export class Page3 {

  loading: Loading;
  toppings: string = '';
  card: any = [];
  bankData: any = [];
  bank: string;
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

  getBank() {
    let code = '9561e4a736e89d89';
    let date: any = new Date();
    let now: any = Date.parse(date) / 1000;
    let param = {
      auth: Md5.hashStr('api_' + code + now),
      authTime: now
    }
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers })
    
    this.http.post(AppGlobal.getInstance().rootUrl + '?c=credit&m=getBank', param, options)
    .toPromise()
    .then(res => {
      this.bankData = res.json().data;
    })
    .catch(error => {
      console.log('访问以上地址时出现了一个异常：');
      console.log(error)
    });
  }

  getCard(e) {
    let code = '9561e4a736e89d89';
    let date: any = new Date();
    let now: any = Date.parse(date) / 1000;
    let param = {
      auth: Md5.hashStr('api_' + code + now),
      authTime: now,
      page: this.page,
      bank: this.bank
    }
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers })

    this.http.post(AppGlobal.getInstance().rootUrl + '?c=credit&m=search', param, options)
    .toPromise()
    .then(res => {
      if(this.page == 1) {
        this.card = res.json().data.list;
      }else if(this.page < res.json().data.pageCount) {
        this.card = this.card.concat(res.json().data.list);
      }else {
        if(this.tempTimes < 2) {
          this.card = this.card.concat(res.json().data.list);
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
    this.getCard(refresher);
    this.getBank();
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.getCard(infiniteScroll);
  }
  goToPage7() {
    let modal = this.modalCtrl.create(Page7);
    modal.present();
  }
  goToPage10() {
    this.navCtrl.push(Page10)
  }

  getDetails(data, page) {
    this.storage.set('data', data);
    switch(page) {
      case 10:
        this.goToPage10();
        break;
    }
  }

}