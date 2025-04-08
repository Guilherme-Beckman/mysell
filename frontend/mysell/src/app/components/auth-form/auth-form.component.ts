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
export class AuthFormComponent implements OnInit, OnDestroy {
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
    this.initializeFormGroup();
    this.applyPasswordValidator();
    this.lockOrientation();
  }

  async ngOnDestroy() {
    await this.unlockOrientation();
  }

  // Inicializa o FormGroup baseado no array de fields
  private initializeFormGroup(): void {
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
  }

  // Aplica o validador de senhas se os campos 'password' e 'confirmPassword' existirem no form
  private applyPasswordValidator(): void {
    if (
      this.form.contains('password') &&
      this.form.contains('confirmPassword')
    ) {
      this.form.setValidators(
        this.createPasswordMatchValidator('password', 'confirmPassword')
      );
    }
  }

  // Cria e retorna um ValidatorFn para verificação da igualdade entre senhas
  private createPasswordMatchValidator(
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

  // Tenta bloquear a orientação para portrait, logando erros se ocorrerem
  private async lockOrientation(): Promise<void> {
    try {
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
    } catch (error) {
      // Opcional: log do erro para depuração
    }
  }

  // Tenta desbloquear a orientação, logando erros se ocorrerem
  private async unlockOrientation(): Promise<void> {
    try {
      await ScreenOrientation.unlock();
      console.log('Orientation unlocked');
    } catch (error) {
      console.error('Error unlocking orientation:', error);
    }
  }

  // Alterna a visibilidade da senha para o campo especificado
  togglePasswordVisibility(fieldName: string): void {
    this.showPassword[fieldName] = !this.showPassword[fieldName];
  }

  // Emite o valor do formulário se o mesmo for válido
  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }

  // Métodos para emissão de eventos de botões de redes sociais e footer
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
