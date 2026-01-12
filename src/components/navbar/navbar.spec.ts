import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbar } from './navbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

describe('NavbarComponent', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Navbar],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
