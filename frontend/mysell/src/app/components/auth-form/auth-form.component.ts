import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';

export interface AuthFormField {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  defaultValue?: any;  
  validators?: any[]; 
}
@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  imports:  [CommonModule, ReactiveFormsModule, IonicModule]
})
export class AuthFormComponent  implements OnInit {
  @Input() title: string = '';
  @Input() buttonText: string = ''; 
  @Input() textGoogleButton: string = '';
  @Input() textFacebookButton: string = '';
  @Input() fields: AuthFormField[] = [];
  @Input() textFooter: string = '';
  @Input() textLink: string = '';
  @Input() link: string = ''; 
  @Output() formSubmitted =  new EventEmitter<any>();
  @Output() googleButtonClicked = new EventEmitter<void>();
  @Output() facebookButtonClicked = new EventEmitter<void>(); 
  @Output() footerClicked = new EventEmitter<void>(); 
  form!: FormGroup;
  constructor(private fb: FormBuilder) {}

  async ngOnInit() {
    const group: { [key: string]: FormControl } = {};
    this.fields.forEach(field => {
      group[field.name] = new FormControl(field.defaultValue || '', field.validators || []);
    });
    this.form = this.fb.group(group);
    console.log(this.fields);
    try {
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
      console.log('Locked to portrait mode for auth form');
    } catch (error) {
      console.error('Error locking orientation:', error);
    }
  }
  async ngOnDestroy() {
    // Unlock orientation when component is destroyed
    try {
      await ScreenOrientation.unlock();
      console.log('Orientation unlocked');
    } catch (error) {
      console.error('Error unlocking orientation:', error);
    }
  }

  onSubmit() { 
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }

  googleEvent() { 
    this.googleButtonClicked.emit();
  }
  facebookEvent() { 
    this.facebookButtonClicked.emit();
  }

  handleFooterClick(){
    this.footerClicked.emit();
  }
}
