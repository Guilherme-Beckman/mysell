import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportHistoryComponentList } from './report-history-list.component';

describe('ReportHistoryComponent', () => {
  let component: ReportHistoryComponentList;
  let fixture: ComponentFixture<ReportHistoryComponentList>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReportHistoryComponentList],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportHistoryComponentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
