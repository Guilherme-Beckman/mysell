import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  imports: [CommonModule],
})
export class SearchBarComponent implements OnInit {
  @Input() placeholder = 'Procurar…';

  @Output() search = new EventEmitter<string>();

  term = '';

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    this.search.emit(this.term.trim());
  }
}
