import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCustomerServiceComponent } from './header-customer-service.component';

describe('HeaderCustomerServiceComponent', () => {
  let component: HeaderCustomerServiceComponent;
  let fixture: ComponentFixture<HeaderCustomerServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderCustomerServiceComponent]
    });
    fixture = TestBed.createComponent(HeaderCustomerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
