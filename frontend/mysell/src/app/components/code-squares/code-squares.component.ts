import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
      const { digit1, digit2, digit3, digit4 } = this.codeForm.value;
      const fullCode = `${digit1}${digit2}${digit3}${digit4}`;
      console.log('Código completo:', fullCode);
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
    }
  }

  onBackspace(event: KeyboardEvent, previousInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && input.value === '' && previousInput) {
      previousInput.focus();
    }
  }
}
