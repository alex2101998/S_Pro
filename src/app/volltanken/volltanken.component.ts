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
  usedValues: any[] = [];
  deckblatt: any = { url: "" };
  username: string;
  joined: boolean = false;
  playerCount: number;
  active: any = false;
  activePlayer: number;
  role: any;
  players: any[] = [];
  finished: boolean = false;
  nextActive: boolean = false;

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
    db.list('currentPlay/game/volltanken/activePlayer').valueChanges().subscribe(x => {
      //@ts-ignore
      if (x[0] == localStorage.getItem('name')) {
        this.active = true;
      }
      else {
        this.active = false;
      }
    })
    db.list('currentPlay/game/volltanken/finishedTurn').valueChanges().subscribe(x => {
      if (x[0] == true) {
        this.finished = true
      }
      else this.finished = false
    })
    db.list('currentPlay/game/volltanken/nextActivePlayer').valueChanges().subscribe(x => {
      //@ts-ignore
      if (x[0] == localStorage.getItem('name')) {
        this.nextActive = true;
      }
      else {
        this.nextActive = false;
      }
    })
    db.list('currentPlay/game/volltanken/players').valueChanges().subscribe(x => {
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
    this.role = localStorage.getItem('role')
  }

  randomCard(start: boolean) {
    if (localStorage.getItem('role') == 'admin' || localStorage.getItem('role') == 'host' || this.nextActive || start) {
      var num = Math.floor(Math.random() * 53);
      if (this.usedValues.length != 53) {
        while (this.usedValues.includes(num)) {
          num = Math.floor(Math.random() * 53);
        }
        this.database.ref('currentPlay/game/volltanken/randomValue').set({
          value: num
        });
        this.database.ref('currentPlay/game/volltanken/usedValues').push(num)
        this.setNextPlayer(start)
      }
    }
    this.startTurn()
  }

  setNextPlayer(start) {
    if (start) {
      this.database.ref('currentPlay/game/volltanken/activePlayer/').set({
        name: this.players[0].name
      });
      if (this.players.length > 1) {
        this.database.ref('currentPlay/game/volltanken/nextActivePlayer/').set({
          name: this.players[1].name
        });
      }
    }
    else {

      //Wenn active Player gleich letzer Spieler der Liste
      if (this.activePlayer == this.players.length - 1) {
        this.database.ref('currentPlay/game/volltanken/players/' + this.players[0].name).set({
          name: this.players[0].name,
          active: true
        });
        this.database.ref('currentPlay/game/volltanken/activePlayer/').set({
          name: this.players[0].name
        });
        if (this.players.length > 1) {
          this.database.ref('currentPlay/game/volltanken/nextActivePlayer/').set({
            name: this.players[1].name
          });
        }
      } else {
        this.database.ref('currentPlay/game/volltanken/players/' + this.players[this.activePlayer + 1].name).set({
          active: true,
          name: this.players[this.activePlayer + 1].name
        });
        this.database.ref('currentPlay/game/volltanken/activePlayer/').set({
          name: this.players[this.activePlayer + 1].name
        });
        this.database.ref('currentPlay/game/volltanken/nextActivePlayer/').set({
          name: this.players[(this.activePlayer + 2) % this.players.length].name
        });
      }
      this.database.ref('currentPlay/game/volltanken/players/' + this.players[this.activePlayer].name).set({
        name: this.players[this.activePlayer].name
      });
    }
  }


  newDeck() {
    this.database.ref('currentPlay/game/volltanken/randomValue').set({
      value: 99
    });
    this.database.ref('currentPlay/game/volltanken/usedValues').set({});

    this.players.forEach(element => {
      this.database.ref('currentPlay/game/volltanken/players/' + element.name).set({
        name: element.name
      });
    });
    this.database.ref('currentPlay/game/volltanken/activePlayer').set({})
    this.database.ref('currentPlay/game/volltanken/nextActivePlayer').set({})

  }

  joinGame() {
    localStorage.setItem('game', 'volltanken')
    this.database.ref('currentPlay/game/volltanken/players/' + localStorage.getItem('name')).set({
      name: localStorage.getItem('name')
    });
    this.joined = true
  }
  exitGame() {
    localStorage.removeItem('game')
    this.database.ref('currentPlay/game/volltanken/players/' + localStorage.getItem('name')).set({});
    this.joined = false
  }

  startGame() {

    this.database.ref('currentPlay/game/volltanken/players/' + this.players[0].name).set({
      name: this.players[0].name,
      active: true
    });
    this.randomCard(true)
    this.playerCount = this.players.length

  }

  finishTurn() {
    this.database.ref('currentPlay/game/volltanken/finishedTurn/').set({
      value: true
    });
  }
  startTurn() {
    this.database.ref('currentPlay/game/volltanken/finishedTurn/').set({
      value: false
    });
  }
}
