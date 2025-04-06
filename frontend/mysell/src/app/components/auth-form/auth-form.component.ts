import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


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

  ngOnInit() {
    const group: { [key: string]: FormControl } = {};
    this.fields.forEach(field => {
      group[field.name] = new FormControl(field.defaultValue || '', field.validators || []);
    });
    this.form = this.fb.group(group);
    console.log(this.fields);
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
