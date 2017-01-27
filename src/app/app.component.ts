/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, trigger, state, style, animate, transition } from '@angular/core';
import { Router,ActivatedRoute } from "@angular/router";

import { AppState } from './app.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styles: [
    require('./app.component.scss')
  ],
  template: require("./app.component.html")
})
export class AppComponent {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';
    isNeedBack: boolean = false;

    constructor(
        public appState: AppState,
        private router: Router,
        private activate: ActivatedRoute
    ) {

        this.router.events.subscribe((e) => {
            this.isNeedBack = e.url === "/" ? true : false;
        })
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

  back() {
      history.back();
  }

  list = [];
  add() {
      this.list.push(Date.now());
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
