import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  constructor(){}

  ngOnInit(){}
}
