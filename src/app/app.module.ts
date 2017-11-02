import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from "@angular/http";
import { MyApp } from './app.component';
import { ImgLazyLoadModule } from "../components/components.module";
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Toast } from "@ionic-native/toast";
import { AppMinimize } from "@ionic-native/app-minimize";

import { TabsPage } from '../pages/tabs/tabs'; 
import { Page1 } from '../pages/page_1/page_1'; // 首页
import { Page2 } from '../pages/page_2/page_2'; // 贷款页
import { Page3 } from '../pages/page_3/page_3'; // 信用卡
import { Page4 } from '../pages/page_4/page_4'; // 发现
import { Page5 } from '../pages/page_5/page_5'; // 新闻列表
import { Page6 } from '../pages/page_6/page_6'; // 新闻详情
import { Page7 } from '../pages/page_7/page_7'; // 意见反馈
import { Page8 } from '../pages/page_8/page_8'; // 常见问题
import { Page9 } from '../pages/page_9/page_9'; // 贷款详情
import { Page10 } from '../pages/page_10/page_10'; // 信用卡详情
import { Page11 } from '../pages/page_11/page_11'; // 贷款分类（精准推荐）
import { Page12 } from '../pages/page_12/page_12'; // 关于我们
import { Page13 } from '../pages/page_13/page_13'; // 客服列表
import { Login } from '../pages/login/login'; 

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    Page1,
    Page2,
    Page3,
    Page4,
    Page5,
    Page6,
    Page7,
    Page8,
    Page9,
    Page10,
    Page11,
    Page12,
    Page13,
    Login
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ImgLazyLoadModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      backButtonText: '返回',
      tabsHideOnSubPages: 'true' // 隐藏所有子页面tabs
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    Page1,
    Page2,
    Page3,
    Page4,
    Page5,
    Page6,
    Page7,
    Page8,
    Page9,
    Page10,
    Page11,
    Page12,
    Page13,
    Login
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Toast,
    AppMinimize,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
