import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.component.html',
  styleUrls: ['./home-supervisor.component.scss'],
})
export class HomeSupervisorComponent implements OnInit {

  constructor(private router:Router, private authService:AuthService, public pushSrv:NotificationsService) { }

  ngOnInit() {
    this.pushSrv.InitPush()
  }

  goToRegister(){
    this.router.navigate(['supervisor/register']);
  }

  goToClientes(){
    this.router.navigate(['supervisor/clientes']);
  }

  goToUpdate(){
    this.router.navigate(['supervisor/update']);
  }

  logout(){
    this.authService.SignOut().then(()=>{
      this.router.navigate(['login']);
    })
  }
}
