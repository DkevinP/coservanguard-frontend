import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavMenu } from './sidenav-menu';

describe('SidenavMenu', () => {
  let component: SidenavMenu;
  let fixture: ComponentFixture<SidenavMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidenavMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
