import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SearchBarComponent implements OnInit {
  @Input() placeholder = 'Procurar…';
  @Output() searchChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();

  term = '';

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    this.search.emit(this.term.trim());
  }

  onInputChange() {
    this.searchChange.emit(this.term);
  }
}
