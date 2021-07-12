import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
  Channel
} from '@capacitor/push-notifications';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  msj: Channel;
  device_token;
  constructor(public http: HttpClient,private toastController : ToastController) { }

  public InitPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.RegisterPush();
    }
  }

  private RegisterPush() {

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('My token: ' + JSON.stringify(token));
        localStorage.setItem("deviceToken", JSON.stringify(token));
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        const data = notification;
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );
  }

  sendNotification(title, mensaje, deviceToken){
    let res = this.http.post('https://fcm.googleapis.com/fcm/send', {
                notification: {
                  title: title,
                  body: mensaje,
                  sound: true,
                  data: {
                    'google.delivered_priority': 'high',
                    'google.original_priority': 'high',
                    collapse_key: 'io.ionic.starter',
                  },
                  id: '1:355095454257:android:46cf037c9d28fd4d306b10',
                },
                to: deviceToken
              }).subscribe(doc=>{
                console.log(doc);
              });
   
  }

  async mostrarToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }
}
