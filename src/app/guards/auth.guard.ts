import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return authService.isLoggedIn().pipe(
    take(1),
    map(loggedIn => {
      const { url } = state;
      if (loggedIn && (url === '/sign/in' || url === '/sign/up')) {
        router.navigateByUrl('/home').then();
        return false;
      }
      if (!loggedIn && url !== '/sign/in' && url !== '/sign/up') {
        router.navigateByUrl('/sign/in').then();
        return false;
      }
      return true;
    })
  );
};
