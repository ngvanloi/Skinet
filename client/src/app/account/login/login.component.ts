import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm?: FormGroup;
  returnUrl: string = '/shop';

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly accountService: AccountService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/shop';
    this.createLoginform();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createLoginform() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("^\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}$")]),
      password: new FormControl('', Validators.required),
    })
  }

  onSubmit() {
    if (!this.loginForm) return;

    this.accountService.login(this.loginForm.value)
      .pipe(
        tap(() => {
          this.router.navigateByUrl(this.returnUrl);
          console.log('user login');
        })
      )
      .subscribe();
  }
}
