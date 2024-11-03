import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';

interface Data {
  value: number;
  currency: string | null;
}
@Component({
  selector: 'app-dashboard-analysis-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatCardModule
  ],
  templateUrl: './dashboard-analysis-card.component.html',
  styleUrl: './dashboard-analysis-card.component.scss'
})
export class DashboardAnalysisCardComponent {
  @Input('title') title!: string;
  @Input('subTitle') subTitle!: string;
  @Input('data') data!: Data;
  @Input('content') content!: string;

}
