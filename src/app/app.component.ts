import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  Event as NavigationEvent,
  NavigationStart,
  Router,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { PermissionsService } from './services/permissions.service';
// import { LoaderService } from './services/loader.service';
// import { ThemePalette } from '@angular/material/core';
// import { ProgressBarMode } from '@angular/material/progress-bar';
// import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  event$!: Subscription;
  title = 'web-app';
  protected router = inject(Router);
  protected isUserSignedIn = false;
  protected permServ = inject(PermissionsService);

  public  _router= inject(Router);
//   loaderServ = inject(LoaderService);
//   isLoading$ = this.loaderServ.isLoading$;
//   color: ThemePalette = 'warn';
//  // mode: ProgressBarMode = 'determinate';
//   mode: ProgressSpinnerMode = 'determinate';
//   value = 50;
  currentURL: string = '';
  ngOnInit(): void {
    // this.getCurrentURL();
     this.currentURL = window.location.pathname;
     //console.log(this.currentURL+" vvvv  Kiran Testing ");
    this.isUserSignedIn = this.permServ.isUserSignedin()
  }

  private getCurrentURL() {
    this.event$ = this.router.events.subscribe({
      next: (event: NavigationEvent) => {
        if (event instanceof NavigationStart) {
          this.currentURL = event.url
        }
      },
    });
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }
}
