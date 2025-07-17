import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProductsPage } from './create-products.page';

describe('CreateProductsPage', () => {
  let component: CreateProductsPage;
  let fixture: ComponentFixture<CreateProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
