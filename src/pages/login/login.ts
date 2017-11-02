import { Component } from '@angular/core';
import { Loading, LoadingController, ViewController, AlertController, ToastController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Md5 } from "ts-md5/dist/md5";
import { Storage } from '@ionic/storage';
import { AppGlobal } from '../../app/app.global';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class Login {

  loginForm: FormGroup;
  loading: Loading;
  mobile: number;
  code: number;
  constructor(
    public viewCtrl: ViewController,
    private http: Http,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private toast: Toast,
    private toastCtrl: ToastController,
  ) {
    this.loginForm = formBuilder.group({
      mobile: ['', Validators.compose([Validators.required, Validators.pattern("^(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$")])],
      code: ['', Validators.compose([Validators.required, Validators.pattern("([0-9]{4})")])]
    })
  }

  showToast(message: string = '操作完成', duration: number = 2000): void {
    this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'top',
      showCloseButton: false
    }).present();
  };

  valida() {
    if(!this.loginForm.controls['mobile'].valid) {
      this.showToast('手机号填写错误');
      return false;
    }
    if(!this.loginForm.controls['code'].valid) {
      this.showToast('验证码填写错误');
      return false;
    } 
    return true;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showLoading(con) {
    if(!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: con,
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

  presentAlert(t, st) {
    const alert = this.alertCtrl.create({
      title: t,
      subTitle: st,
      buttons: ['再试试']
    });
    alert.present();
  }

  login() {
    if(this.valida()) {
      this.showLoading('请稍后...');
      let code = '9561e4a736e89d89';
      let date: any = new Date();
      let now: any = Date.parse(date) / 1000;
      let param = {
        auth: Md5.hashStr('api_' + code + now),
        authTime: now,
        mobile: this.mobile,
        code: this.code
      }
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers })
      
      this.http.post(AppGlobal.getInstance().rootUrl + '?c=user&m=save', param, options)
      .toPromise()
      .then(res => {
        let data = res.json();
        if(data.code == 100200) {
          this.storage.set('loginStatus', data.data[0]).then((val) => {
            AppGlobal.getInstance().loginStatus = val;
            this.showToast('登录成功');
          });
          this.dismiss();
        }else {
          this.presentAlert('登录失败', '请检查手机号或验证码是否填写正确')
        }
        this.dismissLoading();
      })
      .catch(error => {
        console.log('访问以上地址时出现了一个异常：');
        console.log(error)
        this.dismissLoading();
      });
    }
  }

  getCode() {
    if(!this.loginForm.controls['mobile'].valid) {
      this.showToast('手机号填写错误');
    }else {

    }
    // if(!t||isNaN(parseInt(t))) return;
    // this.times = t;
    // let tim = setInterval(() => {
    //   --this.times;
    //   if(this.times < 1) clearInterval(tim);
    // }, 1000);
  }
}
