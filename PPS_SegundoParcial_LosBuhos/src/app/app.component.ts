import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform,
    private router: Router) {
      this.initializeApp();
    }


  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
         SplashScreen.hide();
        this.router.navigateByUrl('splash');
      }, 0);
    });
  }



}
