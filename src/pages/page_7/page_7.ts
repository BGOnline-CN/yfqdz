import { Component } from '@angular/core';
import { Loading, LoadingController, AlertController, NavController, ViewController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Md5 } from "ts-md5/dist/md5";
import { AppGlobal } from '../../app/app.global';

@Component({
  selector: 'page-7',
  templateUrl: 'page_7.html'
})
export class Page7 {

  loading: Loading;
  content = '';
  mobile = '';
  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    private http: Http,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentAlert(title, subTitle) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['关闭']
    });
    alert.present();
  }

  feedback() {
    let code = '9561e4a736e89d89';
    let date: any = new Date();
    let now: any = Date.parse(date) / 1000;
    let param = {
      auth: Md5.hashStr('api_' + code + now),
      authTime: now,
      content: this.content,
      mobile: this.mobile
    }
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers })
    
    this.http.post(AppGlobal.getInstance().rootUrl + '?c=feedback&m=add', param, options)
    .toPromise()
    .then(res => {
      let data = res.json();
      if(data.code == 100200) {
        this.presentAlert('反馈成功', '感谢您对我们的支持，我们将一如既往的为您带来最好的体验！');
      }else {
        this.presentAlert('反馈失败', data.msg + '，感谢您对我们的支持！');
      }
    })
    .catch(error => {
      this.presentAlert('反馈失败', '由于网络的原因本次反馈失败，感谢您对我们的支持！');
      console.log('访问以上地址时出现了一个异常：');
      console.log(error);
    });
  }
}