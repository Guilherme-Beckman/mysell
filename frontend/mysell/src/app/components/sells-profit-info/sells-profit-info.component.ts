import { Component, OnInit } from '@angular/core';
import { ProfitDayComponent } from 'src/app/components/profit-day/profit-day.component';
import { TotalSellsComponent } from 'src/app/components/total-sells/total-sells.component';

@Component({
  selector: 'app-sells-profit-info',
  templateUrl: './sells-profit-info.component.html',
  styleUrls: ['./sells-profit-info.component.scss'],
  imports: [ProfitDayComponent, TotalSellsComponent],
})
export class SellsProfitInfoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
