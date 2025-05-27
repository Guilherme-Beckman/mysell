import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CounterComponent } from 'src/app/components/counter/counter.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { SearchBarComponent } from 'src/app/components/search-bar/search-bar.component';
import { ConfirmButtonComponent } from 'src/app/components/confirm-button/confirm-button.component';
import { ConfirmPopUpComponent } from 'src/app/components/confirm-pop-up/confirm-pop-up.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { MessageService } from 'src/app/services/message.service';
import { ProductsToSellComponent } from 'src/app/components/products-to-sell/products-to-sell.component';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.page.html',
  styleUrls: ['./sell.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CounterComponent,
    LoadingSppinerComponent,
    MessagePerRequestComponent,
    SearchBarComponent,
    ConfirmPopUpComponent,
    ArrowComponent,
    HomeRedirectComponent,
    ProductsToSellComponent,
  ],
})
export class SellPage implements OnInit {
  public isLoading = false;
  public searchTerm: string = '';
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;
  constructor(private messageService: MessageService) {}

  ngOnInit() {}
  public onSearchChange(term: string): void {
    this.searchTerm = term;
  }
}
