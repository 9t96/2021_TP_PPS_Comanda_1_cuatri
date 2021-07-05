import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {

  users:Usuario[];

  constructor(private userService: UserService, 
    private authService:AuthService, 
    private router:Router) {
    this.users = [];
  }

  ngOnInit() {
    this.userService.items.subscribe((users) => {
      this.users = users;
    })
  }

  logout(){
    this.authService.SignOut().then(()=>{
      this.router.navigate(['login']);
    })
  }

}
