import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-social-media-buttons',
  templateUrl: './social-media-buttons.component.html',
  styleUrls: ['./social-media-buttons.component.scss'],
})
export class SocialMediaButtonsComponent implements OnInit {
  @Input() textGoogleButton: string = '';
  @Input() textFacebookButton: string = '';
  @Output() googleEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() facebookEvent: EventEmitter<void> = new EventEmitter<void>();
  constructor() {}

  ngOnInit() {}

  onGoogleClick() {
    this.googleEvent.emit();
  }
  onFacebookClick() {
    this.facebookEvent.emit();
  }
}
