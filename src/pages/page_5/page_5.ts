import { Component } from '@angular/core';
import { Loading, LoadingController, App, NavController, ModalController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Md5 } from "ts-md5/dist/md5";
import { Storage } from '@ionic/storage';
import { AppGlobal } from '../../app/app.global';

import { Page6 } from '../page_6/page_6';

@Component({
  selector: 'page-5',
  templateUrl: 'page_5.html'
})
export class Page5 {

  loading: Loading;
  article: any = [];
  page: number = 1;
  searchTitle: string;
  tempTimes = 1; // 记录page和总页数相等的次数
  noMoreData = false;
  articleType: any = {};
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
    this.storage.get('articleType').then((val) => {
      this.articleType = val;
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

  getArticle(e) {
    let code = '9561e4a736e89d89';
    let date: any = new Date();
    let now: any = Date.parse(date) / 1000;
    let param = {
      auth: Md5.hashStr('api_' + code + now),
      authTime: now,
      page: this.page,
      type: this.articleType.type,
      title: this.searchTitle
    }
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers })
    
    this.http.post(AppGlobal.getInstance().rootUrl + '?c=article&m=search', param, options)
    .toPromise()
    .then(res => {
      if(this.page == 1) {
        this.article = res.json().data.list;
      }else if(this.page < res.json().data.pageCount) {
        this.article = this.article.concat(res.json().data.list);
      }else {
        if(this.tempTimes < 2) {
          this.article = this.article.concat(res.json().data.list);
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
    this.getArticle(refresher);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.getArticle(infiniteScroll);
  }

  goToPage6(data) {
    this.storage.set('data', data);
    // this.app.getRootNav().push(Page6)
    let modal = this.modalCtrl.create(Page6);
    modal.present();
  }
}