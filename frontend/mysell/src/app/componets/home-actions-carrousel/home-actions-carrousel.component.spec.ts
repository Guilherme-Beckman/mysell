import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeActionsCarrouselComponent } from './home-actions-carrousel.component';

describe('HomeActionsCarrouselComponent', () => {
  let component: HomeActionsCarrouselComponent;
  let fixture: ComponentFixture<HomeActionsCarrouselComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeActionsCarrouselComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeActionsCarrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
