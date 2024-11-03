import { Component } from '@angular/core';
import { DashboardAnalysisCardComponent } from '../dashboard-analysis-card/dashboard-analysis-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DashboardAnalysisCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  dashboardAnalysisCards = [
    {
      title: '',
      subTitle: '',
      data: {
        value: 100,
        currency: null
      },
      content: 'Number of Assets'
    },
    {
      title: '',
      subTitle: '',
      data: {
        value: 1000000,
        currency: 'GBP'
      },
      content: 'Value of Assets'
    },
    {
      title: '',
      subTitle: '',
      data: {
        value: 20000,
        currency: 'GBP'
      },
      content: 'Net Assets Value'
    },
    {
      title: '',
      subTitle: '',
      data: {
        value: 500000,
        currency: 'GBP'
      },
      content: 'Purchases in Fascal Year'
    }
  ]

}
