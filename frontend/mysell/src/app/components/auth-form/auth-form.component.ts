import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  ScreenOrientation,
  OrientationType,
} from '@capawesome/capacitor-screen-orientation';
import { EyeSvgComponent } from '../eye-svg/eye-svg.component';
import { SocialMediaButtonsComponent } from '../social-media-buttons/social-media-buttons.component';

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
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EyeSvgComponent,
    SocialMediaButtonsComponent,
  ],
})
export class AuthFormComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() buttonText: string = '';
  @Input() textGoogleButton: string = '';
  @Input() textFacebookButton: string = '';
  @Input() fields: AuthFormField[] = [];
  @Input() textFooter: string = '';
  @Input() textLink: string = '';
  @Input() link: string = '';
  @Input() isRegisterForm: boolean = false; // Flag to indicate if this is a register form

  @Output() formSubmitted = new EventEmitter<any>();
  @Output() googleButtonClicked = new EventEmitter<void>();
  @Output() facebookButtonClicked = new EventEmitter<void>();
  @Output() footerClicked = new EventEmitter<void>();

  form!: FormGroup;
  showPassword: { [key: string]: boolean } = {};

  constructor(private fb: FormBuilder) {}

  async ngOnInit() {
    this.initializeFormGroup();
    
    // If this is a register form, apply the password validators
    if (this.isRegisterForm && this.form.contains('password') && this.form.contains('confirmPassword')) {
      this.applyPasswordValidator();
    }
  }

  async ngOnDestroy() {}

  // Initialize the FormGroup based on the fields array
  private initializeFormGroup(): void {
    const group: { [key: string]: FormControl } = {};

    this.fields.forEach((field) => {
      // Create the form control
      group[field.name] = new FormControl(
        field.defaultValue || '',
        field.validators || []
      );
      
      // Initialize the password visibility state
      if (field.type === 'password') {
        this.showPassword[field.name] = false;
      }
    });

    this.form = this.fb.group(group);
  }

  // Apply password validators if the register form has password and confirmPassword fields
  private applyPasswordValidator(): void {
    // Add the cross-field validator for password matching
    this.form.setValidators(
      this.createPasswordMatchValidator('password', 'confirmPassword')
    );
    
    // Update validation on value changes
    this.form.get('password')?.valueChanges.subscribe(() => {
      this.form.get('confirmPassword')?.updateValueAndValidity();
      this.form.updateValueAndValidity();
    });
    
    this.form.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity();
    });
  }

  // Create a ValidatorFn to check password equality
  private createPasswordMatchValidator(
    passwordField: string,
    confirmPasswordField: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField)?.value;
      const confirmPassword = formGroup.get(confirmPasswordField)?.value;

      // Only validate if both fields have values
      if (password && confirmPassword && password !== confirmPassword) {
        formGroup.get(confirmPasswordField)?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        // Remove the passwordMismatch error if any
        const currentErrors = formGroup.get(confirmPasswordField)?.errors;
        if (currentErrors) {
          const { passwordMismatch, ...otherErrors } = currentErrors;
          if (Object.keys(otherErrors).length === 0) {
            formGroup.get(confirmPasswordField)?.setErrors(null);
          } else {
            formGroup.get(confirmPasswordField)?.setErrors(otherErrors);
          }
        }
        return null;
      }
    };
  }

  // Toggle password visibility for the specified field
  togglePasswordVisibility(fieldName: string): void {
    this.showPassword[fieldName] = !this.showPassword[fieldName];
  }

  // Emit form value if valid
  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    } else {
      // Mark all fields as touched to display validation errors
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Methods to emit social media button events
  googleEvent(): void {
    this.googleButtonClicked.emit();
  }

  facebookEvent(): void {
    this.facebookButtonClicked.emit();
  }

  handleFooterClick(): void {
    this.footerClicked.emit();
  }
}