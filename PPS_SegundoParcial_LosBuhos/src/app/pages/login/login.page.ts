import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/clases/usuario';
import { eEmpleado } from 'src/app/enums/eEmpleado';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import { eRol} from '../../enums/eRol';

class LoginUser{
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  showErrors: boolean = false;
  userData$: Observable<Usuario>;
  message:string;
  user : LoginUser;
  public loginForm: FormGroup;

  get name() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }

  constructor(private authService: AuthService, private router: Router, private fromBuilder: FormBuilder, public userSrv: UserService) { 
    this.user = new LoginUser();
  }

  ngOnInit() {
    this.loginForm = this.fromBuilder.group({
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      password: [this.user.password, Validators.compose([Validators.required])]
    })
  }


  Login(){
    this.user.email = this.loginForm.get('email').value;
    this.user.password = this.loginForm.get('password').value;
    
    this.authService.SignIn(this.user.email, this.user.password)
    .then( async(res) => {    
      const user = await (await this.userSrv.getUserByUid(res.user.uid).toPromise()).data();
      
      if(user.rol == eRol.CLIENTE && !user.aceptado){
        this.authService.SignOut();
        this.presentErrors("Todavía no fue confirmada su cuenta")
      }else{
        localStorage.setItem("userData",JSON.stringify(user));
                
        switch (user.rol) {
          case eRol.DUEÑO:
          case eRol.SUPERVISOR:
            this.router.navigateByUrl('supervisor/home')
            break;
          case eRol.CLIENTE:
            this.router.navigateByUrl('home-clientes')
            break;
          case eRol.EMPLEADO:
            user.tipo_empleado == eEmpleado.MOZO ? this.router.navigateByUrl('home-mozo') : this.router.navigateByUrl('home-cocinero')
            break;
        }
      }
    })
    .catch( err =>{ 
    err.code == "auth/wrong-password" ? this.presentErrors("Uno o más campos son inválidos...") : this.presentErrors("Ha ocurrido un error vuelva a intentar.")
    });
  }

  goToRegister(){
    this.router.navigate(["registro-cliente"]);
  }

  testUser(accountNumber: number){
    switch (accountNumber) {
      case 1:
        this.loginForm.controls['email'].setValue('supervisor@usuario.com') 
        this.loginForm.controls['password'].setValue('123123')
        break;
      case 2:
         this.loginForm.controls['email'].setValue('elcocinero@mail.com') 
         this.loginForm.controls['password'].setValue('123456') 
        break;
      case 3:
        this.loginForm.controls['email'].setValue('usuario@usuario.com') 
        this.loginForm.controls['password'].setValue('666666')
        break;
      case 4:
        this.loginForm.controls['email'].setValue('hectornozo@mozo.com') 
        this.loginForm.controls['password'].setValue('999999')
        break;
      case 5:
        this.loginForm.controls['email'].setValue('elbartender@mail.com') 
        this.loginForm.controls['password'].setValue('123456')
    }
    
  }

  presentErrors(message: string){
    this.message = message;
    this.showErrors = true;
    setTimeout(() => {
      this.showErrors = false;
    }, 3500);
  }


}
