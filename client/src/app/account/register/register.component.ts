import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { map, of, switchMap, tap, timer } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm?: FormGroup;
  errors: string[] = [];
  constructor(private readonly fb: FormBuilder, private readonly accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [null,
        [Validators.required, Validators.pattern("^\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}$")],
        [this.validateEmailNotTaken()]
      ],
      password: [null, [Validators.required]]
    })
  }

  onSubmit() {
    if (!this.registerForm) return;

    this.accountService.register(this.registerForm.value)
      .pipe(
        tap(() => {
          this.router.navigateByUrl('/shop');
        })
      )
      .subscribe();
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return control => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.accountService.checkEmailExists(control.value)
            .pipe(
              map((res) => {
                return res ? { emailExists: true } : null;
              })
            )
        })
      )
    }
  }
}
