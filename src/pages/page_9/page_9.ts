import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppGlobal } from '../../app/app.global';

import { Login } from '../login/login';

@Component({
  selector: 'page-9',
  templateUrl: 'page_9.html'
})
export class Page9 {

  loading: Loading;
  data: any = {};
  switchNews: string = 'cpsm';
  loginStatus: boolean = false;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public modalCtrl : ModalController,
    public loadingCtrl: LoadingController,
    private iab: InAppBrowser
  ) {}

  ionViewDidLoad() {
    this.showLoading();
    this.showDetails();
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
  
  showDetails() {
    this.storage.get('data').then((val) => {
      this.data = val;
      this.dismissLoading();
    });
  }

  goToLogin() {
    let modal = this.modalCtrl.create(Login);
    modal.present();
  }

  openUrl() {
    if(AppGlobal.getInstance().loginStatus) {
      const browser = this.iab.create(this.data.url);
    }else {
      this.goToLogin();
    }
  }
}