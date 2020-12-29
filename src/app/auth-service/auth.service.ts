import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  database = firebase.default.database();
  constructor(db: AngularFireDatabase) {
    
   }

  isUserLoggedIn(){
    let user = localStorage.getItem('name')
    
    if (user != null) {
      return true
    }
    else return false
  }

  logOut(){
    this.database.ref('currentPlay/game/volltanken/players/' + localStorage.getItem('name')).set({});
    this.database.ref('currentPlay/game/saufbaum/players/' + localStorage.getItem('name')).set({});
    this.database.ref('currentUsers').child(localStorage.getItem('name')).remove()
    localStorage.clear()
  }
}
