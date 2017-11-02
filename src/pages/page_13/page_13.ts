import { Component } from '@angular/core';
import { Loading, LoadingController, ViewController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Md5 } from "ts-md5/dist/md5";
import { Storage } from '@ionic/storage';
import { AppGlobal } from '../../app/app.global';

@Component({
  selector: 'page-13',
  templateUrl: 'page_13.html',
})
export class Page13 {

  loading: Loading;
  customer: any = [];
  page: number = 1;
  tempTimes = 1; // 记录page和总页数相等的次数
  noMoreData = false;
  customerType: any = {};
  constructor(
    public viewCtrl: ViewController,
    private http: Http,
    public loadingCtrl: LoadingController,
    private storage: Storage
  ) {}

  ionViewDidLoad() {
    this.showLoading();
    this.storage.get('customerType').then((val) => {
      this.customerType = val;
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

  getCustomer(e) {
    let code = '9561e4a736e89d89';
    let date: any = new Date();
    let now: any = Date.parse(date) / 1000;
    let param = {
      auth: Md5.hashStr('api_' + code + now),
      authTime: now,
      page: this.page,
      type: this.customerType.type
    }
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers })
    
    this.http.post(AppGlobal.getInstance().rootUrl + '?c=customer&m=search', param, options)
    .toPromise()
    .then(res => {
      if(this.page == 1) {
        this.customer = res.json().data.list;
      }else if(this.page < res.json().data.pageCount) {
        this.customer = this.customer.concat(res.json().data.list);
      }else {
        if(this.tempTimes < 2) {
          this.customer = this.customer.concat(res.json().data.list);
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
    this.getCustomer(refresher);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.getCustomer(infiniteScroll);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
