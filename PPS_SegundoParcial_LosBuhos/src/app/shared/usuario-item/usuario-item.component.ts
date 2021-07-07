import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { eRol } from 'src/app/enums/eRol';
import { eToastType } from 'src/app/enums/eToastType';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UsuarioModificacionComponent } from '../usuario-modificacion/usuario-modificacion.component';

@Component({
  selector: 'app-usuario-item',
  templateUrl: './usuario-item.component.html',
  styleUrls: ['./usuario-item.component.scss'],
})
export class UsuarioItemComponent implements OnInit {

  @Input() usuario:any;
  spinner: any; 
  currentUserId:string;
  
  constructor(
    public toastController:ToastController,
    private loadingController: LoadingController,
    private userService:UserService,
    public modalController: ModalController,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.currentUserId = this.authService.getUid();
  }

  async editarUsuario(){
    let user:Usuario = new Usuario();
      user.apellido = this.usuario.apellido;
      user.correo = this.usuario.correo;
      user.cuil = this.usuario.cuil;
      user.dni = this.usuario.dni;
      user.img_src = this.usuario.img_src;
      user.rol = this.usuario.rol;
      user.nombre = this.usuario.nombre;

      if(this.usuario.rol == eRol.EMPLEADO){
        user.aceptado = true;
        user.tipo_empleado = this.usuario.tipo_empleado;
        user.cuil = this.usuario.cuil;
      }else if(this.usuario.rol == eRol.SUPERVISOR || this.usuario.rol == eRol.DUEÑO){
        user.aceptado = true;
        user.tipo_empleado = null;
        user.cuil = this.usuario.cuil;
      }
      else{
        user.aceptado = this.usuario.aceptado;
        user.tipo_empleado = null;
        user.cuil = null;
      }

    const modal = await this.modalController.create({
      component: UsuarioModificacionComponent,
      cssClass: 'modal-update-user',
      componentProps: {
        'user': user,
        'uid': this.usuario.uid
      }
    });
    return await modal.present();
  }

  async eliminarUsuario(){
    await this.presentLoading();
    this.spinner.present();    
    
    this.userService.deleteUser(this.usuario.uid)
    .then(async() => {  
      await this.presentToast("Se borró la cuenta correctamente", eToastType.Success);
    }).catch((err) => {
      console.log(err);
      this.presentToast("Error al borrar la cuenta", eToastType.Warning);
    }).finally(()=>{
      this.spinner.dismiss();
    });
  }

  async presentToast(message:string, type:eToastType){
    const toast = await this.toastController.create({
      color: type,
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading() {
    this.spinner = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
  }
}
