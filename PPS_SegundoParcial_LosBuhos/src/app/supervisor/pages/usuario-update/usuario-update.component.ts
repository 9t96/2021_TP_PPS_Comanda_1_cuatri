import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-usuario-update',
  templateUrl: './usuario-update.component.html',
  styleUrls: ['./usuario-update.component.scss'],
})
export class UsuarioUpdateComponent implements OnInit {

  currentUser:Usuario;

  constructor(private authService:AuthService) {
    this.currentUser = authService.getCurrentUser();
  }

  ngOnInit() {}

}
