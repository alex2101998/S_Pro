import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-volltanken',
  templateUrl: './volltanken.component.html',
  styleUrls: ['./volltanken.component.css']
})
export class VolltankenComponent implements OnInit {

  database = firebase.default.database();
  cardgame: Observable<any[]>;
  cards: any[] = [{ name: "", url: "" }];
  game: Observable<any[]>;
  rnd: any = 0;
  usedValues: any[];
  deckblatt: any = {url: "" };
  username: string;

  constructor(db: AngularFireDatabase
  ) {
    db.list('/cardgames/volltanken/playingCards').valueChanges().subscribe(data => {
      this.cards = data
    });
    db.list('/cardgames/volltanken/deckblatt').valueChanges().subscribe(data => {
      this.deckblatt.url = data[0]
    });
    db.list('currentPlay/game/volltanken/randomValue').valueChanges().subscribe(x => {
      this.rnd = x[0]
    })
    db.list('currentPlay/game/volltanken/usedValues').valueChanges().subscribe(x => {
      this.usedValues = x
    })
  }
  ngOnInit(): void {
    this.username = localStorage.getItem('name')
  }

  randomCard() {
    var num = Math.floor(Math.random() * 53);
    if (this.usedValues.length != 53) {
      while (this.usedValues.includes(num)) {
        num = Math.floor(Math.random() * 53);
      }
      this.database.ref('currentPlay/game/volltanken/randomValue').set({
        value: num
      });
      this.database.ref('currentPlay/game/volltanken/usedValues').push(num)
    }
  }

  newDeck() {
    this.database.ref('currentPlay/game/volltanken/randomValue').set({
      value: 99
    });
    this.database.ref('currentPlay/game/volltanken/usedValues').set({});
  }
}
