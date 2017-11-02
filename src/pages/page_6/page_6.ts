import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-6',
  templateUrl: 'page_6.html'
})
export class Page6 {

  loading: Loading;
  data: any = {};
  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    private storage: Storage,
    public loadingCtrl: LoadingController
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showDetails() {
    this.storage.get('data').then((val) => {
      this.data = val;
      this.dismissLoading();
    });
  }

}