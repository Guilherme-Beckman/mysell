import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
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
  onInputChange(event: Event, nextInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement;

    if (input.value.length === 1 && nextInput) {
      nextInput.focus();
    } else if (input.value.length === 1 && !nextInput) {
      // Se não houver nextInput significa que estamos no último campo
      if (this.codeForm.valid) {
        this.onSubmit();
      }
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
    const digits = pastedText.replace(/\D/g, '').slice(0, 5); // remove não-dígitos e pega no máximo 5

    const controls = ['digit1', 'digit2', 'digit3', 'digit4', 'digit5'];

    digits.split('').forEach((char, index) => {
      const controlName = controls[index];
      if (controlName) {
        this.codeForm.get(controlName)?.setValue(char);
      }
    });

    // Se colou os 5 dígitos, envia automaticamente
    if (digits.length === 5 && this.codeForm.valid) {
      this.onSubmit();
    }
  }
}
