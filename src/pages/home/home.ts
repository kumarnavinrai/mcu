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
  usersetdatetime: any;

  constructor(public navCtrl: NavController, private localNotifications: LocalNotifications, public platform: Platform, public alertCtrl:AlertController, public toast: ToastController, public storage: Storage, private file: File) 
  {
		let todaydate: any = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
		//todaydate = moment(new Date()).format();
		todaydate = moment(todaydate).format();
		this.notifyTime = todaydate;

		this.usersetdatetime = todaydate;
 		alert(this.usersetdatetime);


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

  	temp()
  	{

  		let temp1: any = {action1:"switch1"};

  		this.getKeyName(temp1);

     	if(temp1.hasOwnProperty('action1')){
     		alert("action1 key exists");
		}

  		temp1.action2 = "switch2";

  		alert(JSON.stringify(temp1));
  	}

  	getKeyName(data: any)
  	{
  		let keyinitials: any = 'action';
  		let finalkey: any;
  		for(var i = 1; i <= 100; i++)
        {
        	finalkey = keyinitials + i;
        	if(data.hasOwnProperty(finalkey)){
	     		true;
			}else
			{
				break;
			}
        }

        return finalkey;

  	} 

  	setAlarm()
	{
		let indiatime: any = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});

		
		let indiatimedate: any  = new Date(indiatime);

		

		let indiatimeinmiliseconds: any = indiatimedate.getTime();

		
		

		

		let usersetalarmdate: any  = new Date(this.usersetdatetime);


		let usersetalarmdatemiliseconds: any = usersetalarmdate.getTime();

		

		let differencetosetalarmfromnow: any = usersetalarmdatemiliseconds - indiatimeinmiliseconds;

		

		let phonetime:any = new Date();

		

		let phonetimeinmiliseconds: any = phonetime.getTime();

		

		let finaltimetosetalarm: any = phonetimeinmiliseconds + differencetosetalarmfromnow;

		alert("final date set alarm time");
		alert(new Date(finaltimetosetalarm));

		let idforalarm:any = Math.floor(Math.random() * 20);

		alert(idforalarm); 

		let pointer: any = this;

		//get all notification
		this.localNotifications.getAll().then((notifications: any) => {
 		   
 		   alert(JSON.stringify(notifications));

           if(notifications.length > 0)
           {
   
	           alert(notifications[0].at);

	           alert(notifications.length);

	           let notificationset: boolean = false;
	           let presentnotificationinloop: any;
	           let presentnotificationdata: any;
	           let updateddesciption: any;
	           let differencebetweensetnotificationtimeandnewnotificationtime: any;
	           let notificationtimestoredinnotification: any;
	           let milisecondsforstoretimestamp: any;
	           let datatosort: any;
	           let internaldatasort: any;

              for(var i = 0; i < notifications.length; i++)
              {
              	datatosort = JSON.parse(notifications[i].data);
              	internaldatasort = datatosort.actions;

              	alert("loop "+i);	
              	alert(finaltimetosetalarm);
              	alert(JSON.stringify(datatosort));
              	alert(JSON.stringify(internaldatasort));
              	alert(internaldatasort[0].timestamp);

              	notificationtimestoredinnotification = new  Date(internaldatasort[0].timestamp);

              	milisecondsforstoretimestamp = notificationtimestoredinnotification.getTime();

              	differencebetweensetnotificationtimeandnewnotificationtime =  finaltimetosetalarm - milisecondsforstoretimestamp;

              	alert(differencebetweensetnotificationtimeandnewnotificationtime);

			     if(differencebetweensetnotificationtimeandnewnotificationtime < 60000)
			     {
			     	alert("update this notification with new data");
			     	//update this notification with new data
			     	notificationset = true;
			     	presentnotificationinloop = notifications[i];
			     	presentnotificationdata = datatosort;
			     	if(presentnotificationdata.hasOwnProperty("actions"))
			     	{	
			     		presentnotificationdata.actions.push({switch2:"off",timestamp:new Date(finaltimetosetalarm)});	
			     	}

			     	updateddesciption = notifications[i].text + ' My added description';
			     	alert(updateddesciption);

			     	pointer.localNotifications.update({
					   id: notifications[i].id,	
					   title: 'Motor Switched Off!',	
					   text: updateddesciption,
					   sound: 'file:///storage/sdcard0/navin/alarm.mp3',
					   at: notifications[i].at,
					   led: 'FF0000',
					   data: presentnotificationdata

					});
		 
			     }
			  }

			  alert("notificationset");
			  alert(notificationset);
			  
			  if(!notificationset)
			  {
			  	alert("set new notification");

			  	//set new notification
			  	pointer.localNotifications.schedule({
				   id: idforalarm,	
				   title: 'Motor Switched Off!',	
				   text: 'The water motor you switch on has been switched off now.',
				   sound: 'file:///storage/sdcard0/navin/alarm.mp3',
				   at: new Date(finaltimetosetalarm),
				   led: 'FF0000',
				   data: {actions:[{switch2:"on",timestamp:new Date(finaltimetosetalarm)}]}
				});
 

			  }
           }
           else
           {
           	
           	alert("schedule notification new");

           	//schedule notification new
           	pointer.localNotifications.schedule({
			   id: idforalarm,	
			   title: 'Motor Switched Off!',	
			   text: 'The water motor you switch on has been switched off now.',
			   sound: 'file:///storage/sdcard0/navin/alarm.mp3',
			   at: new Date(finaltimetosetalarm),
			   led: 'FF0000',
			   data: {actions:[{switch1:"on",timestamp:new Date(finaltimetosetalarm)}]}
			});
           }
 
        }); //get all notification ends

      
			

		
	}

	
	getAlarm()
	{

        this.localNotifications.getAll().then((notifications: any) => {
 
           alert(JSON.stringify(notifications));
           alert(notifications[0].at);

           /*let notificationset: boolean = false;
           if(notifications.length > 0)
           {
              for(var i = 0; i <= notifications.length; i++)
              {
			     if(temp >= notification[i].at + 60000)
			     {
			     	//update this notification with new data
			     	notificationset = true;
			     }
			  }

			  if(!notificationset)
			  {
			  	//set new notification
			  }
           }
           else
           {
           	 //schedule notification new
           }*/
 
        });

	}		


  setDatetime()
  {
  let todaydate: any = new Date().toISOString();
		todaydate = moment(new Date()).format();
		this.notifyTime = todaydate;
 		alert(this.notifyTime);	
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
 		
 		let tempdate: any = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
	    let currentDate = new Date(tempdate);
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
	        title: 'All Settings cancelled!',
	        buttons: ['Ok']
	    });
	 
	    alert.present();
	 
	}
 
}
