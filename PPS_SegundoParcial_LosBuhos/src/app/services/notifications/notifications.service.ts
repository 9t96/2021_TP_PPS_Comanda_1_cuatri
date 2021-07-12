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
import { FCM } from '@capacitor-community/fcm';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { eRol } from 'src/app/enums/eRol';
import { eEmpleado } from 'src/app/enums/eEmpleado';
import { eTipoMesa } from 'src/app/enums/eTipoMesa';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  msj: Channel;
  device_token;
  group: string;
  constructor(public http: HttpClient,private toastController : ToastController, private auth: AuthService) { 

  }

  public InitPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.setGroup()
      this.RegisterPush();
      this.RegisterFCM();
      this.SubcribeToTopic(this.group);
    }
  }

  public setGroup(){
    let currentUser = JSON.parse(localStorage.getItem("userData"));
    let rol = currentUser.rol;
    if (rol == eRol.DUEÑO || rol == eRol.SUPERVISOR) {
      this.group = 'supervisor'
    } else {
      switch (currentUser.tipo_empleado) {
        case eEmpleado.MOZO:
          this.group = 'mozo'
          break;
        case eEmpleado.BARTENDER:
          this.group = 'bar'
          break;
        case eEmpleado.COCINERO:
          this.group = 'cocina'
          break;
      }
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
        this.mostrarToast(data.body);
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
      }
    );

  }

  public RegisterFCM() {
    // Get FCM token instead the APN one returned by Capacitor
    FCM.getToken()
    .then((r) => console.log(`Token ${r.token}`))
    .catch((err) => console.log(err));
    // Enable the auto initialization of the library
    FCM.setAutoInit({ enabled: true }).then(() => console.log(`Auto init enabled`));

    // Check the auto initialization status
    FCM.isAutoInitEnabled().then((r) => {
    console.log('Auto init is ' + (r.enabled ? 'enabled' : 'disabled'));
    });
  }

  public SubcribeToTopic(topic:string){
    // now you can subscribe to a specific topic
    FCM.subscribeTo({ topic: topic })
    .then((r) => console.log(`subscribed to topic` + topic))
    .catch((err) => console.log(err));
  }
  
  public DeleteFCM(){
    // Unsubscribe from a specific topic
    this.setGroup()
    FCM.unsubscribeFrom({ topic: this.group })
    .then(() => console.log(`unsubscribed from topic` + this.group))
    .catch((err) => console.log(err));
  }

  public DeleteInstance(){
    // Remove FCM instance
    FCM.deleteInstance()
    .then(() => console.log(`Token deleted`))
    .catch((err) => console.log(err));
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
                    collapse_key: 'pps.segundoparcial.losbuhos',
                  },
                  id: '1:506480302106:android:f75a103a6a8215e0d2d9a3',
                },
                to: '/topics/' + deviceToken
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
