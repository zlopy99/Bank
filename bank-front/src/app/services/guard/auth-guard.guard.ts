import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../user/user.service';
import { firstValueFrom } from 'rxjs';

export const authGuardGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const isUserLogedIn = await firstValueFrom(userService.isUserLogedIn);

  return isUserLogedIn && userService.checkForUserRole(state.url, isUserLogedIn)
    ? true
    : isUserLogedIn
      ? router.navigate(['/home'])
      : router.navigate(['']);
};
