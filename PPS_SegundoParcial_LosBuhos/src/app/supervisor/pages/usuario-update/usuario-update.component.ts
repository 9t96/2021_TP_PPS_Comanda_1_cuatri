import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-usuario-update',
  templateUrl: './usuario-update.component.html',
  styleUrls: ['./usuario-update.component.scss'],
})
export class UsuarioUpdateComponent implements OnInit {

  currentUser:Usuario;

  constructor(private authService:AuthService,
    private router:Router) {
    this.currentUser = authService.getCurrentUser();
  }

  ngOnInit() {}

  logout(){
    this.authService.SignOut().then(()=>{
      this.router.navigate(['login']);
    })
  }

  return(){
    this.router.navigate(['supervisor/home']);
  }

}
