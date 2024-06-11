import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLogComponent } from './account-log.component';

describe('AccountLogComponent', () => {
  let component: AccountLogComponent;
  let fixture: ComponentFixture<AccountLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
