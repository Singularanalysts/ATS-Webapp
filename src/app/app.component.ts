import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  Event as NavigationEvent,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { PermissionsService } from './services/permissions.service';
import { LoaderService } from './services/loader.service';
import { WebsocketService } from './usit/services/websocket.service';

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

  public _router = inject(Router);
  loaderServ = inject(LoaderService);
  isLoading$ = this.loaderServ.isLoading$;
  private websocketService = inject(WebsocketService);
  currentURL: string = '';
  ngOnInit(): void {
    this.currentURL = window.location.pathname;
    this.isUserSignedIn = this.permServ.isUserSignedin()
    this.websocketService.connect();
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
