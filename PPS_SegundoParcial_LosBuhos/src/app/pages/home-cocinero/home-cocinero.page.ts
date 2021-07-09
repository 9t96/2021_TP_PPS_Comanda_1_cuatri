import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AltaProductoComponent } from './../alta-producto/alta-producto.component';
@Component({
  selector: 'app-home-cocinero',
  templateUrl: './home-cocinero.page.html',
  styleUrls: ['./home-cocinero.page.scss'],
})
export class HomeCocineroPage implements OnInit {

  constructor(public authSrv: AuthService, public router: Router) { }

  ngOnInit() {
  }
  logout(){
    this.authSrv.SignOut().then(()=>{
      this.router.navigate(['login']);
    })
  }

 

}
