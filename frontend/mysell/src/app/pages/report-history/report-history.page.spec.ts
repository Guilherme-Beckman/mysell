import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportHistoryPage } from './report-history.page';

describe('ReportHistoryPage', () => {
  let component: ReportHistoryPage;
  let fixture: ComponentFixture<ReportHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
