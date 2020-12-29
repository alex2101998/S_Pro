import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-saufbaum',
  templateUrl: './saufbaum.component.html',
  styleUrls: ['./saufbaum.component.css']
})
export class SaufbaumComponent implements OnInit {

  database = firebase.default.database();
  cardgame: Observable<any[]>;
  cards: any[] = [{ name: "", url: "" }];
  rules: any[] = [];
  game: Observable<any[]>;
  rnd: any = 0;
  usedValues: any[];
  isJack: boolean = false;


  constructor(db: AngularFireDatabase
  ) {
    db.list('/cardgames/52').valueChanges().subscribe(data => {
      this.cards = data
    });
    db.list('currentPlay/game/saufbaum/randomValue').valueChanges().subscribe(x => {
      this.rnd = x[0]
      if (this.cards[this.rnd].name.includes('Jack')) {
        this.isJack = true
      }
      else{
        this.isJack = false
      }
      
    })
    db.list('currentPlay/game/saufbaum/usedValues').valueChanges().subscribe(x => {
      this.usedValues = x
    })
    db.list('currentPlay/game/saufbaum/customRules').valueChanges().subscribe(x => {
     this.rules = x
    })
  }
  ngOnInit(): void {
  }

  randomCard() {
    var num = Math.floor(Math.random() * 53);
    if (this.usedValues.length != 53) {
      while (this.usedValues.includes(num)) {
        num = Math.floor(Math.random() * 53);
      }
      this.database.ref('currentPlay/game/saufbaum/randomValue').set({
        value: num
      });
      this.database.ref('currentPlay/game/saufbaum/usedValues').push(num)
    }
  }

  newDeck() {
    this.database.ref('currentPlay/game/saufbaum/randomValue').set({
      value: 40
    });
    this.database.ref('currentPlay/game/saufbaum/usedValues').set({
      40: 40
    })
    this.database.ref('currentPlay/game/saufbaum/customRules').set({})
  }

  submitRule(event){
    var text = event.target[0].value
    var name = event.target[1].value
    event.preventDefault()
    console.log(text, name);
    this.database.ref('currentPlay/game/saufbaum/customRules').push({
      name: name,
      description: text
    })
    this.isJack = false
  }
}
