import { Component } from '@angular/core';
import { Loading, LoadingController, App, NavController, ModalController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Md5 } from "ts-md5/dist/md5";
import { Storage } from '@ionic/storage';
import { AppGlobal } from '../../app/app.global';

import { Page5 } from '../page_5/page_5';
import { Page6 } from '../page_6/page_6';
import { Page7 } from '../page_7/page_7';
import { Page11 } from '../page_11/page_11';

@Component({
  selector: 'page-4',
  templateUrl: 'page_4.html'
})
export class Page4 {

  loading: Loading;
  page: number = 1;
  tempTimes = 1;
  noMoreData = false;
  switchNews: string = 'dkgl';
  dkgl: any = [];
  hdfl: any = [];
  bdzl: any = [];
  constructor(
    public navCtrl: NavController,
    public modalCtrl : ModalController,
    public app: App,
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
  
  goToPage5(name, type) {
    this.storage.set('articleType', {name, type});
    this.navCtrl.push(Page5);
  }
  goToPage6() {
    // this.app.getRootNav().push(Page6)
    let modal = this.modalCtrl.create(Page6);
    modal.present();
  }
  goToPage7() {
    let modal = this.modalCtrl.create(Page7);
    modal.present();
  }
  goToPage11(name, label6) {
    this.storage.set('loanType', {name, label6});
    this.navCtrl.push(Page11);
  }

  getData(e) {
    let code = '9561e4a736e89d89';
    let date: any = new Date();
    let now: any = Date.parse(date) / 1000;
    let param = {
      auth: Md5.hashStr('api_' + code + now),
      authTime: now,
      page: this.page
    }
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers })
    
    switch(this.switchNews) {
      case 'dkgl':
        this.http.post(AppGlobal.getInstance().rootUrl + '?c=article&m=getArticle&type=4', param, options)
        .toPromise()
        .then(res => {
          if(this.page == 1) {
            this.dkgl = res.json().data.list;
          }else if(this.page < res.json().data.pageCount) {
            this.dkgl = this.dkgl.concat(res.json().data.list);
          }else {
            if(this.tempTimes < 2) {
              this.dkgl = this.dkgl.concat(res.json().data.list);
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
        break;
      case 'hdfl':
        this.http.post(AppGlobal.getInstance().rootUrl + '?c=article&m=getArticle&type=5', param, options)
        .toPromise()
        .then(res => {
          if(this.page == 1) {
            this.hdfl = res.json().data.list;
          }else if(this.page < res.json().data.pageCount) {
            this.hdfl = this.hdfl.concat(res.json().data.list);
          }else {
            if(this.tempTimes < 2) {
              this.hdfl = this.hdfl.concat(res.json().data.list);
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
        break;
      case 'bdzl':
        this.http.post(AppGlobal.getInstance().rootUrl + '?c=article&m=getArticle&type=6', param, options)
        .toPromise()
        .then(res => {
          if(this.page == 1) {
            this.bdzl = res.json().data.list;
          }else if(this.page < res.json().data.pageCount) {
            this.bdzl = this.bdzl.concat(res.json().data.list);
          }else {
            if(this.tempTimes < 2) {
              this.bdzl = this.bdzl.concat(res.json().data.list);
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
        break;
    }
    
  }

  changeSwitch() {
    this.page = 1;
    this.tempTimes = 1;
    this.showLoading();
    this.doRefresh('');
  }

  doRefresh(refresher) {
    this.page = 1;
    this.tempTimes = 1;
    this.noMoreData = false;
    this.getData(refresher);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    setTimeout(() => {
      this.getData(infiniteScroll);
    }, 2500);
  }

  getDetails(data, page) {
    this.storage.set('data', data);
    switch(page) {
      case 6:
        this.goToPage6();
        break;
    }
  }

}