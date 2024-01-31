import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
const keyFrames = [
  style({ transform: 'rotate(0deg)', offset: '0'}),
  style({ transform: 'rotate(1turn)', offset: '1'})
];
@Component({
  selector: 'app-sidebar-v2',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './sidebar-v2.component.html',
  styleUrls: ['./sidebar-v2.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger("rotate", [

      transition("* => close", [
        animate('1500ms', keyframes(keyFrames))
      ])
    ]),
  ]

})
export class SidebarV2Component {
  isSubMenuOpen: boolean[] = new Array<any>().fill(false);
  menuList: any[] = [];

  private router = inject(Router);
  private apiServ = inject(ApiService);
  private snackBarServ = inject(SnackBarService);

  ngOnInit(): void {
    this.getSideNavData();
  }

  private getSideNavData() {
    this.apiServ.getJson('assets/side-nav-data.json').subscribe({
      next: (data) => {
        this.menuList = data;
      },
    });
  }

  onSignOut() {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: 'You have signed out!',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-signout'],
    };
    this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);

    this.router.navigate(['login']);
  }

  toggleSubMenu(index: number) {
    this.isSubMenuOpen = this.isSubMenuOpen.map((_, i) => i === index);
    this.isSubMenuOpen[index] = !this.isSubMenuOpen[index];
  }
}
