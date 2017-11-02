import { Component } from '@angular/core';
import { Loading, NavController, ViewController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Md5 } from "ts-md5/dist/md5";
import { AppGlobal } from '../../app/app.global';

@Component({
  selector: 'page-12',
  templateUrl: 'page_12.html'
})
export class Page12 {

  loading: Loading;
  article: any = [];
  page: number = 1;
  noMoreData = false;
  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    private http: Http,
    public loadingCtrl: LoadingController
  ) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

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

  getArticleType7(e) {
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
    
    this.http.post(AppGlobal.getInstance().rootUrl + '?c=article&m=getArticle&type=8', param, options)
    .toPromise()
    .then(res => {
      // if(this.page == 1) {
        this.article = res.json().data[0];
      // }else if(this.page <= res.json().data.pageCount) {
      //   this.article = this.article.concat(res.json().data.list);
      // }else {
      //   this.noMoreData = true;
      // }
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
    this.getArticleType7(refresher);
  }
}