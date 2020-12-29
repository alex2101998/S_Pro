import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if (this.authService.isUserLoggedIn()){
      return true;
    }
    if (state.url != "/logout") {
      this.router.navigate(['login'], { queryParams: {returnUrl: state.url}})
    }
    else this.router.navigate(['login'])
  }
}
