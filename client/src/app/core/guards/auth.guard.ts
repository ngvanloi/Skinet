import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private readonly accountService: AccountService, private readonly router: Router) { }
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.accountService.currentUser$
			.pipe(
				map((auth) => {
					if (auth) {
						return true;
					}
					return false;
				}),
				tap((shouldNavigate) => {
					if (!shouldNavigate) {
						this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
					}
				})
			)
	}

}
