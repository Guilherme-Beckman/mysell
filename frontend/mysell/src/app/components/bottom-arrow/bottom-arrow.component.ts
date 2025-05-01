import { CommonModule } from '@angular/common';
import { Component, input, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-bottom-arrow',
  templateUrl: './bottom-arrow.component.html',
  styleUrls: ['./bottom-arrow.component.scss'],
  imports: [CommonModule],
})
export class BottomArrowComponent implements OnInit {
  @Input() direction: 'right' | 'left' = 'right';
  @Input() pageToGo: string = '';
  constructor(private navController: NavController) {}

  ngOnInit() {}
  redirectToPage(): void {
    this.navController.navigateRoot(this.pageToGo);
  }
}
