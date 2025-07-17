import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailValidationPage } from './email-validation.page';

describe('EmailValidationPage', () => {
  let component: EmailValidationPage;
  let fixture: ComponentFixture<EmailValidationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailValidationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
