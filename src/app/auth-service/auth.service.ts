import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isUserLoggedIn(){
    let user = localStorage.getItem('name')
    
    if (user != null) {
      return true
    }
    else return false
  }

  logOut(){
    localStorage.clear()
  }
}
