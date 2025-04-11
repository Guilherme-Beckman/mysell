import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-arrow',
  templateUrl: './arrow.component.html',
  styleUrls: ['./arrow.component.scss'],
  imports: [CommonModule],
})
export class ArrowComponent implements OnInit {
  @Input() direction: string = '';
  @Input() pageToGo: string = '';
  constructor(private navController: NavController) {}

  ngOnInit() {}

  redirectToPage(): void {
    this.navController.navigateRoot(this.pageToGo);
  }
}
