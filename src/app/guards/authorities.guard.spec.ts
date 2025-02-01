import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authoritiesGuard } from './authorities.guard';

describe('authoritiesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authoritiesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
