import { Component, ViewChild } from '@angular/core';
import { Loading, LoadingController, App, Tabs, NavController, ModalController, Slides } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Md5 } from "ts-md5/dist/md5";
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppGlobal } from '../../app/app.global';

import { Page6 } from '../page_6/page_6';
import { Page7 } from '../page_7/page_7';
import { Page9 } from '../page_9/page_9';
import { Page10 } from '../page_10/page_10';
import { Page11 } from '../page_11/page_11';

@Component({
  selector: 'page-1',
  templateUrl: 'page_1.html'
})
export class Page1 {

  @ViewChild('mySlides1') slides1: Slides;
  @ViewChild('mySlides2') slides2: Slides;
  loading: Loading;
  myInput: string;
  page: number = 1;
  noMoreData = false;
  images: any;
  news: any;
  loan: any = {};
  card: any = {};
  timer;
  constructor(
    public navCtrl: NavController,
    public app: App,
    public modalCtrl: ModalController,
    public tabs: Tabs,
    private http: Http,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private iab: InAppBrowser
  ) {}

  // autoPlay() {
  //   this.slides1.startAutoplay();
  //   this.slides2.startAutoplay();
  // }

  ionViewWillEnter() {
    this.timer = setTimeout(() => {
      if(this.slides1) this.slides1.startAutoplay();
      if(this.slides2) this.slides2.startAutoplay();
    }, 2500)
    this.storage.get('loginStatus').then((val) => {
      AppGlobal.getInstance().loginStatus = val;
    });
  }

  ionViewDidLeave() {
    clearTimeout(this.timer)
    this.slides1.stopAutoplay();
    this.slides2.stopAutoplay();
  } 

  ionViewDidLoad() {
    setTimeout(() => {
      if(this.slides1) this.slides1.autoplayDisableOnInteraction = false;
      if(this.slides2) this.slides2.autoplayDisableOnInteraction = false;  
    }, 2500)
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
  goToPage2() {
    this.tabs.select(1);
  }
  goToPage3() {
    this.tabs.select(2);
  }
  goToPage6() {
    let modal = this.modalCtrl.create(Page6);
    modal.present();
  }
  goToPage7() {
    let modal = this.modalCtrl.create(Page7);
    modal.present();
  }
  goToPage9() {
    this.navCtrl.push(Page9)
  }
  goToPage10() {
    this.navCtrl.push(Page10)
  }
  goToPage11(name, label6) {
    label6 != undefined ? this.storage.set('loanType', {name, label6}) : this.storage.set('loanType', {name})
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
    
    this.http.post(AppGlobal.getInstance().rootUrl + '?c=article&m=getArticle&type=1', param, options)
    .toPromise()
    .then(res => {
      if(res.json().data.list < 1) {
        this.images = [1];
      }else {
        this.images = res.json().data.list;
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
    this.http.post(AppGlobal.getInstance().rootUrl + '?c=article&m=getArticle&type=2', param, options)
    .toPromise()
    .then(res => {
      if(res.json().data.list < 1) {
        this.news = [1];
      }else {
        this.news = res.json().data.list;
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

    this.http.post(AppGlobal.getInstance().rootUrl + '?c=loan&m=getLoan', param, options)
    .toPromise()
    .then(res => {
      this.loan = res.json().data;
      this.dismissLoading();
      if(e) e.complete();
    })
    .catch(error => {
      console.log('访问以上地址时出现了一个异常：');
      console.log(error)
      this.dismissLoading();
      if(e) e.complete();
    });

    this.http.post(AppGlobal.getInstance().rootUrl + '?c=credit&m=getCredit', param, options)
    .toPromise()
    .then(res => {
      this.card = res.json().data;
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
    this.noMoreData = false;
    this.getData(refresher);
  }

  getDetails(data, page) {
    this.storage.set('data', data);
    switch(page) {
      case 6:
        if(data.url && data.url.length > 7) {
          const browser = this.iab.create(data.url);
        }else {
          this.goToPage6();
        }
        break;
      case 9:
        this.goToPage9();
        break;
      case 10:
        this.goToPage10();
        break;
    }
  }
}