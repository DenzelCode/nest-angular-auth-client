import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomItemComponent } from './room-item.component';

describe('RoomItemComponent', () => {
  let component: RoomItemComponent;
  let fixture: ComponentFixture<RoomItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
