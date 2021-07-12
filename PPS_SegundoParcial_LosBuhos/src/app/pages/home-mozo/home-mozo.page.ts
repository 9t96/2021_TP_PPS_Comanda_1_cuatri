import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.page.html',
  styleUrls: ['./home-mozo.page.scss'],
})
export class HomeMozoPage implements OnInit {


  constructor(public authSrv: AuthService, public router: Router, public pushSrv: NotificationsService) { }

  ngOnInit() {
    this.pushSrv.InitPush()
  }

  logout(){
    this.authSrv.SignOut().then(()=>{
      this.router.navigate(['login']);
    })
  }

}
