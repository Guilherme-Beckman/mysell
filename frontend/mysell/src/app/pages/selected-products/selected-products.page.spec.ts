import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedProductsPage } from './selected-products.page';

describe('SelectedProductsPage', () => {
  let component: SelectedProductsPage;
  let fixture: ComponentFixture<SelectedProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
