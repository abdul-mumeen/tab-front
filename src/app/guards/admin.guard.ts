import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/index';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router,private authService:AuthService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check role
    return this.authService.checkUser()
    .pipe(map((result)=>{
      var role:string='';
      if(result){
        role = result.role;
      }
      if(role==='admin'){
        return true;
      }else{
        if(role!=''){
          //they have a different role so redirect them back to root so they
          //don't end up in a loop going to login over and over
          this.router.navigate(['/']);
        }else{
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        }
        return false;
      }

    }));
  }
}