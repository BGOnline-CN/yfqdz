import { Component, ViewChild } from '@angular/core';
import { Tabs } from "ionic-angular";

import { Page1 } from '../page_1/page_1';
import { Page2 } from '../page_2/page_2';
import { Page3 } from '../page_3/page_3';
import { Page4 } from '../page_4/page_4';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('mainTabs') tabs:Tabs;
  tab1Root = Page1;
  tab2Root = Page2;
  tab3Root = Page3;
  tab4Root = Page4;

  constructor() {

  }
}
