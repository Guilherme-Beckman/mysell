import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  ScreenOrientation,
  OrientationType,
} from '@capawesome/capacitor-screen-orientation';
import { EyeSvgComponent } from '../eye-svg/eye-svg.component';

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
  imports: [CommonModule, ReactiveFormsModule, IonicModule, EyeSvgComponent],
})
export class AuthFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() buttonText: string = '';
  @Input() textGoogleButton: string = '';
  @Input() textFacebookButton: string = '';
  @Input() fields: AuthFormField[] = [];
  @Input() textFooter: string = '';
  @Input() textLink: string = '';
  @Input() link: string = '';
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() googleButtonClicked = new EventEmitter<void>();
  @Output() facebookButtonClicked = new EventEmitter<void>();
  @Output() footerClicked = new EventEmitter<void>();
  form!: FormGroup;
  showPassword: { [key: string]: boolean } = {};
  constructor(private fb: FormBuilder) {}

  async ngOnInit() {
    const group: { [key: string]: FormControl } = {};
    this.fields.forEach((field) => {
      group[field.name] = new FormControl(
        field.defaultValue || '',
        field.validators || []
      );

      if (field.type === 'password') {
        this.showPassword[field.name] = false;
      }
    });
    this.form = this.fb.group(group);
    if (
      this.form.contains('password') &&
      this.form.contains('confirmPassword')
    ) {
      this.form.setValidators(
        this.passwordMatchValidator('password', 'confirmPassword')
      );
    }

    try {
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
    } catch (error) {}
  }
  async ngOnDestroy() {
    try {
      await ScreenOrientation.unlock();
      console.log('Orientation unlocked');
    } catch (error) {
      console.error('Error unlocking orientation:', error);
    }
  }
  togglePasswordVisibility(fieldName: string): void {
    this.showPassword[fieldName] = !this.showPassword[fieldName];
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

  handleFooterClick() {
    this.footerClicked.emit();
  }

  passwordMatchValidator(
    passwordField: string,
    confirmPasswordField: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField)?.value;
      const confirmPassword = formGroup.get(confirmPasswordField)?.value;
      if (password !== confirmPassword) {
        formGroup
          .get(confirmPasswordField)
          ?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        formGroup.get(confirmPasswordField)?.setErrors(null);
        return null;
      }
    };
  }
}
