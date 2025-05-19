import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YourProductsPage } from './your-products.page';

describe('YourProductsPage', () => {
  let component: YourProductsPage;
  let fixture: ComponentFixture<YourProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(YourProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
