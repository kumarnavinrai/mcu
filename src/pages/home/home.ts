import { Component } from '@angular/core';
import { NavController, Platform, AlertController, ToastController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	
  notifyTime: any;
  notifications: any[] = [];
  days: any[];
  chosenHours: number;
  chosenMinutes: number;
  testtext: string = "Navin";	

  constructor(public navCtrl: NavController, private localNotifications: LocalNotifications, public platform: Platform, public alertCtrl:AlertController, public toast: ToastController, public storage: Storage, private file: File) 
  {
		
		this.notifyTime = moment(new Date()).format();
 
        this.chosenHours = new Date().getHours();
        this.chosenMinutes = new Date().getMinutes();
 
        this.days = [
            {title: 'Monday', dayCode: 1, checked: false},
            {title: 'Tuesday', dayCode: 2, checked: false},
            {title: 'Wednesday', dayCode: 3, checked: false},
            {title: 'Thursday', dayCode: 4, checked: false},
            {title: 'Friday', dayCode: 5, checked: false},
            {title: 'Saturday', dayCode: 6, checked: false},
            {title: 'Sunday', dayCode: 0, checked: false}
        ];


	    if(this.platform.is('cordova'))
	    {
	        this.localNotifications.on('click', function(notif){
		      this.toastfun('Notification id : ' + notif.id + ' clicked !');
		    });


		}    
		let pointer: any = this;
		setTimeout(() => {
			pointer.storage.get('appstartedfirsttime').then((value) => {
		      pointer.testtext = value;
		    });
		},3000);

        
	
 
  }

  checkPath()
  {

  	alert(this.file.externalRootDirectory);

	this.file.checkDir(this.file.externalRootDirectory, 'navin').then(_ => alert('Directory exists')).catch(err => alert('Directory doesnt exist'));

	this.file.checkFile(this.file.externalRootDirectory + 'navin/', 'alarm.mp3').then(_ => alert('File exists')).catch(err => alert('File doesnt exist'));

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

  /*setAlarm()
  {
  	// Schedule delayed notification
	this.localNotifications.schedule({
	   id: 1,	
	   title: 'Local ILocalNotification Example',	
	   text: 'Delayed ILocalNotification',
	   at: new Date(new Date().getTime() + 3600),
	   led: 'FF0000',
	   sound: isAndroid? 'file://sound.mp3': 'file://beep.caf'
	});

  }*/


	ionViewDidLoad()
	{
 
    }
 
    timeChange(time){
	    let choosendate = new Date(this.notifyTime);
	    this.chosenHours = choosendate.getHours();
	    this.chosenMinutes = choosendate.getMinutes();
	}
 
    addNotifications()
    {
 
	    let currentDate = new Date();
	    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.
	 
	    for(let day of this.days){
	 
	        if(day.checked)
	        {
	 
	            let firstNotificationTime = new Date();
	          
	            let dayDifference = day.dayCode - currentDay;
	 
	            if(dayDifference < 0){
	                dayDifference = dayDifference + 7; // for cases where the day is in the following week
	            }
	
	            firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
	      
	            firstNotificationTime.setHours(this.chosenHours);
	           
	             
	            firstNotificationTime.setMinutes(this.chosenMinutes);
alert("firstNotificationTime");
	 			 alert(firstNotificationTime);

	            let notification = {
	                id: day.dayCode,
	                title: 'Hey!',
	                text: 'You just got notified :)',
	                sound: 'file:///storage/sdcard0/navin/alarm.mp3',
	                at: firstNotificationTime,
	                every: 'week'
	            };
alert("JSON.stringify(notification)");
				alert(JSON.stringify(notification));	 
	            
	            this.notifications.push(notification);
alert("JSON.stringify(this.notifications)");
	            alert(JSON.stringify(this.notifications));
	 
	        }
	 
	    }
	 
	    console.log("Notifications to be scheduled: ", this.notifications);
	    alert(JSON.stringify(this.notifications));
	 
	    if(this.platform.is('cordova'))
	    {
	 
	        // Cancel any existing notifications
	        this.localNotifications.cancelAll().then(() => {
	 
	            // Schedule the new notifications
	            this.localNotifications.schedule(this.notifications);

	            
	 
	            this.notifications = [];
	 
	            let alert = this.alertCtrl.create({
	                title: 'Notifications set',
	                buttons: ['Ok']
	            });
	 
	            alert.present();
	 
	        });


	        this.localNotifications.on("click", function (notification) {
				this.showNot();
			});
	 
	    }
	 
	}

	showNot()
	{
		this.testtext = "Navin Kumar Rai";
	}
 
    cancelAll()
    {
 
	    this.localNotifications.cancelAll();
	 
	    let alert = this.alertCtrl.create({
	        title: 'Notifications cancelled',
	        buttons: ['Ok']
	    });
	 
	    alert.present();
	 
	}
 
}
