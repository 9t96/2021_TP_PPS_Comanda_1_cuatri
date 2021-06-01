import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { runInThisContext } from 'vm';
import { eRol } from '../enums/eRol';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupervisorGuard implements CanActivate {

  constructor(private authService:AuthService, private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    let user = this.authService.getCurrentUser();
    
    if(user?.rol == eRol.SUPERVISOR || user?.rol == eRol.DUEÑO){
      return true;
    }
    else{
      this.router.navigate(['login']);
      return false;
    }
  }
  
}
