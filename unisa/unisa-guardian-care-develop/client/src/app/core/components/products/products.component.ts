import { Component } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  constructor(readonly productService: ProductService) { }

  /**
   * Handle click on product subscribe button
   */
  onSubscribe(productId: number): void {
    window.alert("Coming soon...")
  }
}
