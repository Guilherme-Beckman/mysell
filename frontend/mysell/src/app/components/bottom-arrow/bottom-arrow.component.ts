import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonSegment } from '@ionic/angular/standalone';

@Component({
  selector: 'app-bottom-arrow',
  templateUrl: './bottom-arrow.component.html',
  styleUrls: ['./bottom-arrow.component.scss'],
  imports: [CommonModule],
})
export class BottomArrowComponent implements OnInit {
  @Input() direction: 'right' | 'left' = 'right';
  @Output() arrowClick = new EventEmitter<void>();

  constructor(private navController: NavController) {}

  ngOnInit() {}

  onClick() {
    this.arrowClick.emit();
  }
}
