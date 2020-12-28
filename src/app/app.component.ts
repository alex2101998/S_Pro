import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  database = firebase.default.database();
  title = 'Silvester';
  cardgame: Observable<any[]>;
  cards: any[] = [{ name: "", url: "" }];
  game: Observable<any[]>;
  rnd: any = 0;
  usedValues: any[];

  constructor(db: AngularFireDatabase
  ) {
    db.list('/cardgames/32').valueChanges().subscribe(data => {
      this.cards = data
    });
    db.list('currentPlay/randomValue').valueChanges().subscribe(x => {
      this.rnd = x[0]
    })
    db.list('currentPlay/usedValues').valueChanges().subscribe(x => {
      this.usedValues = x
    })
  }
  ngOnInit(): void {
  }

  randomCard() {
    var num = Math.floor(Math.random() * 32);
    if (this.usedValues.length != 33) {
      while (this.usedValues.includes(num)) {
        num = Math.floor(Math.random() * 32);
      }

      this.database.ref('currentPlay/randomValue').set({
        value: num
      });
      this.database.ref('currentPlay/usedValues').push(num)
    }
  }

  newDeck() {
    this.database.ref('currentPlay/randomValue').set({
      value: 20
    });
    this.database.ref('currentPlay/usedValues').set({
      20: 20
    })
  }
}
