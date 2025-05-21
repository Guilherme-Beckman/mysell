import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArrowComponent } from '../components/arrow/arrow.component';
import { HomeRedirectComponent } from '../components/home-redirect/home-redirect.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { LoadingSppinerComponent } from '../components/loading-sppiner/loading-sppiner.component';
import { MessagePerRequestComponent } from '../components/message-per-request/message-per-request.component';
import { BottomArrowComponent } from '../components/bottom-arrow/bottom-arrow.component';
import { NavController } from '@ionic/angular';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-your-products',
  templateUrl: './your-products.page.html',
  styleUrls: ['./your-products.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ArrowComponent,
    HomeRedirectComponent,
    SearchBarComponent,
    BottomArrowComponent,
    LoadingSppinerComponent,
    MessagePerRequestComponent,
  ],
})
export class YourProductsPage implements OnInit {
  public searchTerm: string = '';
  public isLoading = false;
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;
  constructor(
    private navController: NavController,
    private messageService: MessageService
  ) {}

  ngOnInit() {}
  public onSearchChange(term: string): void {
    this.searchTerm = term;
  }
  public navigateToEditPage(): void {
    this.navController.navigateRoot('/edit-available-products');
  }
}
