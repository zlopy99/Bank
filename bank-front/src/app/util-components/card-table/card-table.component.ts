import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrl: './card-table.component.css'
})
export class CardTableComponent {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];

}
