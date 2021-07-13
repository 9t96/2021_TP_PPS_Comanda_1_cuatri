import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-home-cocinero',
  templateUrl: './home-cocinero.page.html',
  styleUrls: ['./home-cocinero.page.scss'],
})
export class HomeCocineroPage implements OnInit {
  solvedSurvey: any;

  constructor(public authSrv: AuthService, public router: Router, public pushSrv:NotificationsService) { }

  ionViewWillEnter(){
    this.solvedSurvey = JSON.parse(localStorage.getItem("solvedSurvey"))
  }

  ngOnInit() {
    this.pushSrv.InitPush()
  }
  logout(){
    this.authSrv.SignOut().then(()=>{
      localStorage.clear();
      this.router.navigate(['login']);
    })
  }

}
