import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  database = firebase.default.database();
  cardgame: Observable<any[]>;
  cardsRed: any[] = [{url: "" }];
  cardsGrey: any[] = [{url: "" }];
  game: Observable<any[]>;
  rnd: any[] = [0,0];
  usedValuesRed: any[];
  usedValuesGrey: any[];
  players: any[];
  deckblattRed: any = {url: "" };
  deckblattGrey: any = { url: "" };
  username: string;
  joined: boolean = false;
  playerCount: number;
  active: any = false;
  activePlayer: number;
  role: any;
  gamename: string;
  spielfarbe: string[];

  constructor(db: AngularFireDatabase
  ) {
    this.gamename = "Activity";
    this.spielfarbe = ["rot", "grau"];
    //Red Cards
    db.list(`/cardgames/${this.gamename.toLowerCase()}/${this.gamename.toLowerCase() + this.spielfarbe[0]}`).valueChanges().subscribe(data => {
      this.cardsRed = data
    });
    db.list(`/cardgames/${this.gamename.toLowerCase()}/activitydeckblatt/${"deckblatt" + this.spielfarbe[0]}`).valueChanges().subscribe(data => {
      this.deckblattRed.url = data[0]
    });
    db.list(`currentPlay/game/${this.gamename.toLowerCase()}/randomValue/${this.spielfarbe[0]}`).valueChanges().subscribe(x => {
      this.rnd[0] = x[0]
    })
    db.list(`currentPlay/game/${this.gamename.toLowerCase()}/usedValues/${this.spielfarbe[0]}`).valueChanges().subscribe(x => {
      this.usedValuesRed = x
    })
    //Grey Cards
    db.list(`/cardgames/${this.gamename.toLowerCase()}/${this.gamename.toLowerCase() + this.spielfarbe[1]}`).valueChanges().subscribe(data => {
      this.cardsGrey = data
    });
    db.list(`/cardgames/${this.gamename.toLowerCase()}/activitydeckblatt/${"deckblatt" + this.spielfarbe[1]}`).valueChanges().subscribe(data => {
      this.deckblattGrey.url = data[0]
    });
   db.list(`currentPlay/game/${this.gamename.toLowerCase()}/randomValue/${this.spielfarbe[1]}`).valueChanges().subscribe(x => {
      this.rnd[1] = x[0]
    })
    db.list(`currentPlay/game/${this.gamename.toLowerCase()}/usedValues/${this.spielfarbe[1]}`).valueChanges().subscribe(x => {
      this.usedValuesGrey = x
    })
    db.list(`currentPlay/game/${this.gamename.toLowerCase()}/activePlayer`).valueChanges().subscribe(x => {
      //@ts-ignore
      if (x[0] == localStorage.getItem('name')) {
        this.active = true;
      }
      else {
        this.active = false;
      }
    })
    db.list(`currentPlay/game/${this.gamename.toLowerCase()}/players`).valueChanges().subscribe(x => {
      this.players =x 

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

  randomCardRed(start: boolean) {
    if (localStorage.getItem('role') == 'admin' || localStorage.getItem('role') == 'host' || this.active) {
      var num = Math.floor(Math.random() * this.cardsRed.length);
      if (this.usedValuesRed.length != this.cardsRed.length) {
        while (this.usedValuesRed.includes(num)) {
          num = Math.floor(Math.random() * this.cardsRed.length);
        }
        this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/randomValue/${this.spielfarbe[0]}`).set({
          value: num
        });
        this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/usedValues/${this.spielfarbe[0]}`).push(num)

        if (!start) {
          if (this.activePlayer == this.players.length - 1) {
            this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/players/` + this.players[0].name).set({
              name: this.players[0].name,
              active: true
            });
          } else {
            this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/players/` + this.players[this.activePlayer + 1].name).set({
              active: true,
              name: this.players[this.activePlayer + 1].name
            });
          }

          this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/players/` + this.players[this.activePlayer].name).set({
            name: this.players[this.activePlayer].name
          });
          if (this.activePlayer == this.players.length - 1) {
            this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/activePlayer/`).set({
              name: this.players[0].name
            });
          }
          else {
            this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/activePlayer/`).set({
              name: this.players[this.activePlayer + 1].name
            });
          }
        }
      }
    }
  }

  randomCardGrey(start: boolean) {
    if (localStorage.getItem('role') == 'admin' || localStorage.getItem('role') == 'host' || this.active) {
      var num = Math.floor(Math.random() * this.cardsGrey.length);
      if (this.usedValuesGrey.length != this.cardsGrey.length) {
        while (this.usedValuesGrey.includes(num)) {
          num = Math.floor(Math.random() * this.cardsGrey.length);
        }
        this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/randomValue/${this.spielfarbe[1]}`).set({
          value: num
        });
        this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/usedValues/${this.spielfarbe[1]}`).push(num)

        if (!start) {
          this.changePlayer();
        }
      }
    }
  }

  changePlayer(){
    if (this.activePlayer == this.players.length - 1) {
      this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/players/` + this.players[0].name).set({
        name: this.players[0].name,
        active: true
      });
    } else {
      this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/players/` + this.players[this.activePlayer + 1].name).set({
        active: true,
        name: this.players[this.activePlayer + 1].name
      });
    }

    this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/players/` + this.players[this.activePlayer].name).set({
      name: this.players[this.activePlayer].name
    });
    if (this.activePlayer == this.players.length - 1) {
      this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/activePlayer/`).set({
        name: this.players[0].name
      });
    }
    else {
      this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/activePlayer/`).set({
        name: this.players[this.activePlayer + 1].name
      });
    }
  }

  newDeck() {
    if (localStorage.getItem('role') == 'admin' || localStorage.getItem('role') == 'host') {
      this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/randomValue/${this.spielfarbe[0]}`).set({
        value: 300
      });
      this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/randomValue/${this.spielfarbe[1]}`).set({
        value: 300
      });
      this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/usedValues/${this.spielfarbe[0]}`).set({});
      this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/usedValues/${this.spielfarbe[1]}`).set({});

      this.players.forEach(element => {
        this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/players/` + element.name).set({
          name: element.name
        });
      });
    }
  }

  joinGame() {
    localStorage.setItem('game', `${this.gamename.toLowerCase}`)
    this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/players/` + localStorage.getItem('name')).set({
      name: localStorage.getItem('name')
    });
    this.joined = true
  }
  exitGame() {
    localStorage.removeItem('game')
    this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/players/` + localStorage.getItem('name')).set({});
    this.joined = false
  }

  startGame() {
    if (localStorage.getItem('role') == 'admin' || localStorage.getItem('role') == 'host') {
      this.database.ref(`currentPlay/game/${this.gamename.toLowerCase()}/players/` + this.players[0].name).set({
        name: this.players[0].name,
        active: true
      });
      this.randomCardRed(true)
      this.playerCount = this.players.length
    }
  }

  //Timer
  timerDuration: number = 60;
  timeLeft: number = this.timerDuration;
  interval;

startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.resetTimer();
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  resetTimer(){
    clearInterval(this.interval);
    this.timeLeft = this.timerDuration;
  }

}
