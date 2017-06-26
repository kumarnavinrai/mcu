import { Component, ViewChild } from '@angular/core';
import { Nav, ToastController, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Autostart } from '@ionic-native/autostart';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

declare var cordova:any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  alert: any;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public toast: ToastController, private autostart: Autostart, public storage: Storage, private alertCtrl: AlertController) {
    
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    let check: any = this;
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.autostart.enable();
      this.statusBar.styleDefault();
      this.splashScreen.hide();


      if(this.platform.is('cordova'))
      {
        /*cordova.plugins.notification.local.on('click', function (notification) {
            console.log('onclick', arguments);
            check.toastfun('clicked: ' + notification.id);
        });*/
        
        cordova.plugins.backgroundMode.setEnabled(true);
        cordova.plugins.backgroundMode.overrideBackButton();
        cordova.plugins.backgroundMode.excludeFromTaskList();

        cordova.plugins.notification.local.on('trigger', function (notification) {
            console.log('ontrigger', arguments);
            check.toastfun('triggered: ' + notification.id);
            check.storage.set('appstartedfirsttime', 'Navin Kumar'+ notification.id);
        });
      }  



      this.platform.registerBackButtonAction(() => {



        if(this.nav.canGoBack()){
          this.nav.pop();
        }else{
          if(this.alert){ 
            this.alert.dismiss();
            this.alert =null;     
          }else{
            //this.showAlert();
           }
        }


      });
        

    });//platform ready ends here

   
    
  }

  showAlert() {
      this.alert = this.alertCtrl.create({
        title: 'Exit?',
        message: 'Do not exit the app ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.alert =null;
            }
          },
          {
            text: 'Exit',
            handler: () => {
              this.platform.exitApp();
            }
          }
        ]
      });

      if(this.alert != undefined)
      {
        this.alert.present();
      }  
    }


     showToast() {
        let toast = this.toast.create({
          message: 'Press Again to exit',
          duration: 2000,
          position: 'bottom'
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();
      }

  toastfun(data: string) {
      let toast = this.toast.create({
        message: data,
        duration: 10000,
        position: 'middle'
      });

      toast.onDidDismiss(() => {
       
        //this.changePassPrompt('');
      });

      toast.present();
    }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
