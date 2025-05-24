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
import { MatDialog } from '@angular/material/dialog';
import { AlertPopupComponent } from './dialogs/alert-popup/alert-popup.component';
// import { AlertPopupComponent } from './shared/alert-popup/alert-popup.component'; // adjust path as needed


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit, OnDestroy {
  event$!: Subscription;
  title = 'web-app';
  protected router = inject(Router);
  protected permServ = inject(PermissionsService);
  loaderServ = inject(LoaderService);
  websocketService = inject(WebsocketService);
  dialog = inject(MatDialog);

  isLoading$ = this.loaderServ.isLoading$;
  currentURL: string = '';
  protected isUserSignedIn = false;
  public _router = inject(Router);

  private dialogOpen = false; // 🔒 Prevents multiple dialogs

  ngOnInit(): void {
    this.currentURL = window.location.pathname;
    this.isUserSignedIn = this.permServ.isUserSignedin();

    
    // Connect WebSocket
    this.websocketService.connect();

    this.websocketService.getMessages().subscribe((data: string) => {
      try {
        const parsed = JSON.parse(data); // Parse if JSON
        const messageText = parsed.message || data;

        if (messageText === 'New Requirements Loaded' && this.getToken()) {
          // this.dialog.open(AlertPopupComponent, {
          //   data: messageText,
          //   disableClose: true
          // });
    this.showAlertDialog(messageText);
          this.playNotificationSound();
        }
      } catch (e) {
        // Handle if not JSON
        if (data === 'New Requirements Loaded') {
          // this.dialog.open(AlertPopupComponent, {
          //   data,
          //   disableClose: true
          // });
           this.showAlertDialog(data);
        } 
      }
    });
  }

  private showAlertDialog(message: string) {
    if (this.dialogOpen) return;

    this.dialogOpen = true;
    const dialogRef = this.dialog.open(AlertPopupComponent, {
      data: message,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.dialogOpen = false;
    });
  }
  getToken() {
    return localStorage.getItem('token');
  }
  playNotificationSound() {
    const audio = new Audio();
    audio.src = 'assets/alert.mp3';
    audio.load();
    audio.play();
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

