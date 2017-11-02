import { Component, ViewChild } from '@angular/core';
import { App, Platform, ModalController, IonicApp, Keyboard, Nav, ToastController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AppGlobal } from './app.global';
import { AppMinimize } from '@ionic-native/app-minimize';
import { Toast } from '@ionic-native/toast';

import { Login } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { Page8 } from '../pages/page_8/page_8'; 
import { Page12 } from '../pages/page_12/page_12'; 
import { Page13 } from '../pages/page_13/page_13'; 

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('mycontent') nav: Nav;
  backButtonPressed: boolean = false;  //用于判断返回键是否触发
  rootPage: any = TabsPage;
  loginStatus: any;
  constructor(
    private toast: Toast,
    private toastCtrl: ToastController,
    private appMinimize: AppMinimize,
    public platform: Platform, 
    private statusBar: StatusBar,
    private keyboard: Keyboard,
    private ionicApp: IonicApp,
    splashScreen: SplashScreen, 
    public app: App, 
    public modalCtrl : ModalController,
    private storage: Storage,
    public alertCtrl: AlertController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      splashScreen.hide();
      statusBar.styleBlackTranslucent();
      this.registerBackButtonAction();//注册返回按键事件
    });
  }

  presentConfirm(t, st) {
    const alert = this.alertCtrl.create({
      title: t,
      message: st,
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确定',
          handler: () => {
            this.removeLoginStatus();
          }
        }
      ]
    });
    alert.present();
  }

  getLoginStatus() {
    this.loginStatus = AppGlobal.getInstance().loginStatus;
  }

  removeLoginStatus() {
    AppGlobal.getInstance().loginStatus = false;
    this.storage.remove('loginStatus').then(() => {
      this.showToast('退出成功');
    });
  }

  loingOut() {
    this.presentConfirm('真的要退出吗？', '贷款及信用卡服务需要登录才能使用哦！');
  }

  goToPage8() {
    // this.app.getRootNav().push(Page8)
    let modal = this.modalCtrl.create(Page8);
    modal.present();
  }

  goToPage12() {
    // this.app.getRootNav().push(Page8)
    let modal = this.modalCtrl.create(Page12);
    modal.present();
  }

  goToPage13(name, type) {
    this.storage.set('customerType', {name, type});
    let modal = this.modalCtrl.create(Page13);
    modal.present();
  }

  goToLogin() {
    let modal = this.modalCtrl.create(Login);
    modal.present();
  }

  minimize(): void {
    this.appMinimize.minimize()
  }

  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  registerBackButtonAction() {
    if(!this.isAndroid()) {
      return;
    }
    this.platform.registerBackButtonAction(() => {
      if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
        this.keyboard.close();
        return;
      }
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.ionicApp._toastPortal.getActive() ||this.ionicApp._loadingPortal.getActive()|| this.ionicApp._overlayPortal.getActive()
      let activePortal = this.ionicApp._modalPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
        return;
      }
      let activeVC = this.nav.getActive();
      let tabs = activeVC.instance.tabs;
      let activeNav = tabs.getSelected();
      return activeNav.canGoBack() ? activeNav.pop() : this.showExit(); // this.minimize();
    }, 1);
  }

  showToast(message: string = '操作完成', duration: number = 2000): void {
    if (this.isMobile()) {
      this.toast.show(message, String(duration), 'center').subscribe();
    } else {
      this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'bottom',
        showCloseButton: false
      }).present();
    }
  };

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.showToast('再按一次退出应用');
      this.backButtonPressed = true;
      setTimeout(() => { //2秒内没有再次点击返回则将触发标志标记为false
        this.backButtonPressed = false;
      }, 2000)
    }
  }

}
