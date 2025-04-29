import { Component, OnInit } from '@angular/core';
import { IonSearchbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss'],
  imports: [IonSearchbar],
})
export class HomeNavComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
