import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAvailableProductsPage } from './edit-available-products.page';

describe('EditAvailableProductsPage', () => {
  let component: EditAvailableProductsPage;
  let fixture: ComponentFixture<EditAvailableProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAvailableProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
