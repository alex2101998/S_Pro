import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from '../auth-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  database = firebase.default.database();

  username = ''
  password = ''
  returnUrl: string;
  msgs = [];
  users: any[] = [];

  constructor(private router: Router,
    private authservice: AuthService,
    private route: ActivatedRoute,
    db: AngularFireDatabase
  ) {
    db.list('/user').valueChanges().subscribe(data => {
      this.users = data
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  showPasswordTrue() {
    var x = (<HTMLInputElement>document.getElementById('pw'))
    x.type = "text"
  }
  showPasswordFalse() {
    var x = (<HTMLInputElement>document.getElementById('pw'))
    x.type = "password"
  }

  focusnext() {
    document.getElementById('pw').focus()
  }

  checkLogin() {
    var time = new Date().toISOString()
    this.users.forEach(user => {
      if (user.username == this.username && user.password == this.password) {
        localStorage.setItem('name', user.username)
        localStorage.setItem('role', user.role)
        this.database.ref('currentUsers/' + user.username).set({
            time: time
          }
        )

      }
    });

    if (this.authservice.isUserLoggedIn()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }
}
