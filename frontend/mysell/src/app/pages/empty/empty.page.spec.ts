import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyPage } from './empty.page';

describe('EmptyPage', () => {
  let component: EmptyPage;
  let fixture: ComponentFixture<EmptyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
