import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  message:string;
  user : LoginUser;
  public loginForm: FormGroup;

  get name() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }

  constructor(private authService: AuthService, private router: Router, private fromBuilder: FormBuilder) { 
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
    this.authService.SignIn(this.user.email, this.user.password).then( res =>{
      this.router.navigate(['home']);
    })
    .catch( err =>{ 
      err.code == "auth/wrong-password" ? this.presentErrors("Uno o mas campos son invalidos...") : this.presentErrors("Ha ocurrido un error vuelva a intentar.")
    })
  }

  goToRegister(){
    this.router.navigate(["registro-personal"]);
  }

  testUser(accountNumber: number){
    switch (accountNumber) {
      case 1:
        this.loginForm.controls['email'].setValue('admin@admin.com') 
        this.loginForm.controls['password'].setValue('111111')
        break;
      case 2:
        this.loginForm.controls['email'].setValue('invitado@invitado.com') 
        this.loginForm.controls['password'].setValue('222222')
        break;
      case 3:
        this.loginForm.controls['email'].setValue('usuario@usuario.com') 
        this.loginForm.controls['password'].setValue('333333')
        break;
      case 4:
        this.loginForm.controls['email'].setValue('anonimo@anonimo.com') 
        this.loginForm.controls['password'].setValue('444444')
        break;
      case 5:
        this.loginForm.controls['email'].setValue('tester@tester.com') 
        this.loginForm.controls['password'].setValue('555555')
    }
    
  }

  presentErrors(message: string){
    this.message = message;
    this.showErrors = true;
/*     setTimeout(() => {
      this.showErrors = false;
    }, 3500); */
  }


}
