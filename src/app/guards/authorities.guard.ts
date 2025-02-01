import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authoritiesGuard: CanActivateFn = (route, state) => {
  const authService : AuthService = inject(AuthService);
  const router = inject(Router);
  const requiredAuthority: string = route.data?.['authority'] || '';

  return authService.getAuthorities().pipe(
    take(1),
    map((authorities: string[]) => {
      const hasAccess = authorities.includes(requiredAuthority);
      return hasAccess;
    })
  );
};
