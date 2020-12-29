import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route:ActivatedRoute,private router:Router) {  }

  username: string;

  ngOnInit(): void {
    this.username = localStorage.getItem('name')
  }

  goToGame(game){
    this.router.navigate(['/'+game]);
  }
}
