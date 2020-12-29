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
  username: string;
  joined: boolean = false;
  playerCount: number;
  active: any = false;
  activePlayer: number;
  role: any;
  players: any[];


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
    db.list('currentPlay/game/saufbaum/activePlayer').valueChanges().subscribe(x => {
      //@ts-ignore
      if (x[0] == localStorage.getItem('name')) {
        this.active = true;
      }
      else {
        this.active = false;
      }
    })
    db.list('currentPlay/game/saufbaum/players').valueChanges().subscribe(x => {
      this.players = x

      this.players.forEach(player => {
        if (player.name == localStorage.getItem('name')) {
          this.joined = true;
          this.role = localStorage.getItem('role')
        }
        if (player.active == true) {
          this.activePlayer = this.players.indexOf(player)
        }
      });
      if (this.players.length == 0) {
        this.newDeck()
      }
    })
  }
  ngOnInit(): void {
    this.username = localStorage.getItem('name')
  }

  randomCard(start: boolean) {
    if (localStorage.getItem('role') == 'admin' || localStorage.getItem('role') == 'host' || this.active) {
      var num = Math.floor(Math.random() * 53);
      if (this.usedValues.length != 53) {
        while (this.usedValues.includes(num)) {
          num = Math.floor(Math.random() * 53);
        }
        this.database.ref('currentPlay/game/saufbaum/randomValue').set({
          value: num
        });
        this.database.ref('currentPlay/game/saufbaum/usedValues').push(num)

        if (!start) {
          if (this.activePlayer == this.players.length - 1) {
            this.database.ref('currentPlay/game/saufbaum/players/' + this.players[0].name).set({
              name: this.players[0].name,
              active: true
            });
          } else {
            this.database.ref('currentPlay/game/saufbaum/players/' + this.players[this.activePlayer + 1].name).set({
              active: true,
              name: this.players[this.activePlayer + 1].name
            });
          }

          this.database.ref('currentPlay/game/saufbaum/players/' + this.players[this.activePlayer].name).set({
            name: this.players[this.activePlayer].name
          });
          if (this.activePlayer == this.players.length - 1) {
            this.database.ref('currentPlay/game/saufbaum/activePlayer/').set({
              name: this.players[0].name
            });
          }
          else {
            this.database.ref('currentPlay/game/saufbaum/activePlayer/').set({
              name: this.players[this.activePlayer + 1].name
            });
          }
        }
      }
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
    this.players.forEach(element => {
      this.database.ref('currentPlay/game/saufbaum/players/' + element.name).set({
        name: element.name
      });
    });
  }

  submitRule(event){
    var text = event.target[0].value
    var name = localStorage.getItem('name')
    event.preventDefault()
    console.log(text, name);
    this.database.ref('currentPlay/game/saufbaum/customRules').push({
      name: name,
      description: text
    })
    this.isJack = false
  }

  joinGame() {
    localStorage.setItem('game', 'saufbaum')
    this.database.ref('currentPlay/game/saufbaum/players/' + localStorage.getItem('name')).set({
      name: localStorage.getItem('name')
    });
    this.joined = true
  }
  exitGame() {
    localStorage.removeItem('game')
    this.database.ref('currentPlay/game/saufbaum/players/' + localStorage.getItem('name')).set({});
    this.joined = false
  }
  startGame() {
    if (localStorage.getItem('role') == 'admin' || localStorage.getItem('role') == 'host') {
      this.database.ref('currentPlay/game/saufbaum/players/' + this.players[0].name).set({
        name: this.players[0].name,
        active: true
      });
      this.randomCard(true)
      this.playerCount = this.players.length
    }
  }
}
