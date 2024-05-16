import { Component } from '@angular/core';
import { UserService } from './services/user/user.service';
import { isValueDefined } from './util-components/util-methods/util-methods';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isUserLogedIn!: boolean;
  token!: boolean;

  constructor(private _userService: UserService,) { 
    _userService.isUserLogedIn.subscribe(resp => {
      this.isUserLogedIn = resp;
    });
  }
  
}
