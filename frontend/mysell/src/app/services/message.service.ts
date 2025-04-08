import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private successMessageSource = new BehaviorSubject<string>('');
  private errorMessageSource = new BehaviorSubject<string>('');

  successMessage$ = this.successMessageSource.asObservable();
  errorMessage$ = this.errorMessageSource.asObservable();
  constructor() {}

  setSuccessMessage(message: string, next: any): void {
    const nextMessage = next?.title ? next.title : '';
    this.successMessageSource.next(message + ' ' + nextMessage);
    this.clearMessagesAfterDelay();
  }

  setErrorMessage(message: string, error: any): void {
    const errorMessage = error?.error?.title ? error.error.title : '';
    this.errorMessageSource.next(message + ' ' + errorMessage);
    this.clearMessagesAfterDelay();
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessageSource.next('');
      this.errorMessageSource.next('');
    }, 2000);
  }
}
