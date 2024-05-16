import { Component } from '@angular/core';
import { UserApiService } from '../../services/user/user-api.service';
import { LoginRequestDto } from '../../util-components/dto/dto-interfaces';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email!: string;
  password!: string;
  private unsubscribe$ = new Subject<void>();
  badCredentials = true;

  constructor(
    private _userApiService: UserApiService,
    private _userService: UserService,
    private router: Router,
  ) { }

  login() {
    const loginDto: LoginRequestDto = {
      email: this.email,
      password: this.password,
    }

    this._userApiService.logIn(loginDto)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          const accessToken = response.headers.get('access_token');
          const refreshToken = response.headers.get('refresh_token');

          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);

          this.badCredentials = true;
          this._userService.updateUserLogIn(true);

          this.router.navigate(['/home']);

        }, error: (err) => {
          this.badCredentials = false;
        }
      });
  }
  
  logout() {
    this._userService.logout();
  }

}
