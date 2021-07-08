import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { eEmpleado } from '../enums/eEmpleado';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MozoGuard implements CanActivate {
  constructor(private authService:AuthService, private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let user = this.authService.getCurrentUser();
    
      if(user?.tipo_empleado == eEmpleado.MOZO){
        return true;
      }
      else{
        this.router.navigate(['login']);
        return false;
      }
  }
}
