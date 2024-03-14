import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-header',
  templateUrl: './card-header.component.html',
  styleUrl: './card-header.component.css'
})
export class CardHeaderComponent {
  @Input() title: string = '';

  constructor(private router: Router) {}

  navigateToClientsOrAccounts(value: string) {
    this.router.navigateByUrl('/' + value.toLowerCase());
  }

}
