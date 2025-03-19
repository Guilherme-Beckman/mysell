package com.project.mysell.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.dto.product.ProductDTO;
import com.project.mysell.dto.product.ProductResponseDTO;
import com.project.mysell.dto.product.ProductUpdateDTO;
import com.project.mysell.dto.product.barcode.ProductStructure;
import com.project.mysell.service.product.ProductService;
import com.project.mysell.service.product.barcode.APIProductBarCodeService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private APIProductBarCodeService apiProductBarCodeService;

    @PostMapping()
    public ResponseEntity<Mono<ProductResponseDTO>> createProduct(@Valid @RequestBody ProductDTO productDTO, @RequestHeader("Authorization") String token) {
        Mono<ProductResponseDTO> newProduct = this.productService.createProduct(productDTO, token);
        return ResponseEntity.ok().body(newProduct);
    }
    @GetMapping("/code/{barcode}")
    public ResponseEntity<Mono<ProductStructure>> getProductByBarcode(@PathVariable Long barcode) {
        Mono<ProductStructure> newProduct = this.apiProductBarCodeService.getProductByBarCode(barcode);
        return ResponseEntity.ok().body(newProduct);
    }
    @GetMapping("/my")
    public ResponseEntity<Flux<ProductResponseDTO>> getProductByUserId(@RequestHeader("Authorization") String token) {
    	Flux<ProductResponseDTO> products  = this.productService.getProductByUserId(token);
        return ResponseEntity.ok().body(products);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Mono<ProductResponseDTO>> getProductById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
    	Mono<ProductResponseDTO> product  = this.productService.getProductResponseById(token, id);
        return ResponseEntity.ok().body(product);
    }
    @GetMapping()
    public ResponseEntity<Flux<ProductResponseDTO>> getAllProducts() {
        Flux<ProductResponseDTO> products  = this.productService.getAllProducts();
        return ResponseEntity.ok().body(products);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mono<ProductResponseDTO>> updateProduct (@PathVariable Long id, @RequestBody @Valid ProductUpdateDTO productDTO, @RequestHeader("Authorization") String token) {
        Mono<ProductResponseDTO> updatedProduct  = this.productService.updateProduct(id, productDTO, token);
        return ResponseEntity.ok().body(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Mono<Void>> deleteProduct (@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Mono<Void> deletedProduct = this.productService.deleteProduct(id, token);
        return ResponseEntity.ok().body(deletedProduct);
    }
}
