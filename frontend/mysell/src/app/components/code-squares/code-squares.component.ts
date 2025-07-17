import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-code-squares',
  templateUrl: './code-squares.component.html',
  styleUrls: ['./code-squares.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class CodeSquaresComponent implements OnInit {
  @Output() submitCode = new EventEmitter<string>();

  codeForm = new FormGroup({
    digit1: new FormControl('', [
      Validators.required,
      this.integerOnlyValidator,
    ]),
    digit2: new FormControl('', [
      Validators.required,
      this.integerOnlyValidator,
    ]),
    digit3: new FormControl('', [
      Validators.required,
      this.integerOnlyValidator,
    ]),
    digit4: new FormControl('', [
      Validators.required,
      this.integerOnlyValidator,
    ]),
    digit5: new FormControl('', [
      Validators.required,
      this.integerOnlyValidator,
    ]),
  });

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    if (this.codeForm.valid) {
      const { digit1, digit2, digit3, digit4, digit5 } = this.codeForm.value;
      const fullCode = `${digit1}${digit2}${digit3}${digit4}${digit5}`;
      this.submitCode.emit(fullCode);
    } else {
      console.log('Formulário inválido.');
    }
  }

  integerOnlyValidator(control: AbstractControl): ValidationErrors | null {
    const valor: string = control.value;
    if (valor && !/^\d+$/.test(valor)) {
      return { integerOnly: true };
    }
    return null;
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const key = event.key;
    if (!/^\d$/.test(key)) {
      event.preventDefault();
    }
  }

  onInputChange(event: Event, nextInput?: HTMLInputElement): void {
    const input = event.target as HTMLInputElement;
    // Remove espaços em branco do valor digitado
    const trimmedValue = input.value.replace(/\s/g, '');
    if (input.value !== trimmedValue) {
      input.value = trimmedValue;
      const controlName = input.getAttribute('formControlName') || '';
      this.codeForm.get(controlName)?.setValue(trimmedValue);
    }
    if (input.value.length === 1 && nextInput) {
      nextInput.focus();
    }
    const formValues = Object.values(this.codeForm.value);
    const allFilled = formValues.every(
      (val) => val && val.toString().length === 1
    );
    if (allFilled && this.codeForm.valid) {
      this.onSubmit();
    }
  }

  onBackspace(event: KeyboardEvent, previousInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && input.value === '' && previousInput) {
      previousInput.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    // Remove tudo que não for dígito e limita a 5 caracteres
    const digits = pastedText.replace(/\D/g, '').slice(0, 5);
    const controls = ['digit1', 'digit2', 'digit3', 'digit4', 'digit5'];
    digits.split('').forEach((char, index) => {
      const controlName = controls[index];
      if (controlName) {
        this.codeForm.get(controlName)?.setValue(char);
      }
    });
    if (digits.length === 5 && this.codeForm.valid) {
      this.onSubmit();
    }
  }
}
