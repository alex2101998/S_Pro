import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-busfahrer',
  templateUrl: './busfahrer.component.html',
  styleUrls: ['./busfahrer.component.css']
})
export class BusfahrerComponent implements OnInit {

  database = firebase.default.database();
  cardgame: Observable<any[]>;
  cards: any[] = [{ name: "", url: "" }];
  game: Observable<any[]>;
  rnd: any[];
  usedValues: any[];
  deckblatt: any = {url: "" };
  username: string;
  gamename: string;

  constructor(db: AngularFireDatabase
  ) {
    this.gamename = "busfahrer";
    db.list('/cardgames/52').valueChanges().subscribe(data => {
      this.cards = data;
      this.deckblatt = data[40];
    });
    db.list(`currentPlay/game/${this.gamename}/randomValue`).valueChanges().subscribe(x => {
      this.rnd = x
    })
    db.list(`currentPlay/game/${this.gamename}/usedValues`).valueChanges().subscribe(x => {
      this.usedValues = x
    })
  }
  ngOnInit(): void {
    this.username = localStorage.getItem('name');
  }

  randomCard(buttonNumber: any) {
    var num = Math.floor(Math.random() * this.cards.length);
    if (this.usedValues.length != this.cards.length) {
      while (this.usedValues.includes(num)) {
        var num = Math.floor(Math.random() * this.cards.length);
      }
      switch(buttonNumber){
        case 0: {
          this.database.ref(`currentPlay/game/${this.gamename}/randomValue`).update({0:num});
          break;
        }
        case 1: {
          this.database.ref(`currentPlay/game/${this.gamename}/randomValue`).update({1:num});
          break;
        }
        case 2: {
          this.database.ref(`currentPlay/game/${this.gamename}/randomValue`).update({2:num});
          break;
        }
        case 3: {
          this.database.ref(`currentPlay/game/${this.gamename}/randomValue`).update({3:num});
          break;
        }
        default: {
          throw new Error("Button Nummer ist falsch. Sie muss 0, 1, 2 oder 3 sein.")
        }
      }
      this.database.ref(`currentPlay/game/${this.gamename}/usedValues`).push(num)
    }
  }

  newDeck() {
    this.database.ref(`currentPlay/game/${this.gamename}/randomValue`).set({
      0: 40,
      1: 40,
      2: 40,
      3: 40
    });
    this.database.ref(`currentPlay/game/${this.gamename}/usedValues`).set({40:40});
  }

 fail() {
    this.database.ref(`currentPlay/game/${this.gamename}/randomValue`).set({
      0: 40,
      1: 40,
      2: 40,
      3: 40
    });
  }
}
