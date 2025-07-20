import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const adminGuard: CanActivateFn = () => {
  return localStorage.getItem('userRole') === 'ADMIN';
};
