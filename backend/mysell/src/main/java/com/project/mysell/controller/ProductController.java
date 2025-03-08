package com.project.mysell.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.dto.ProductDTO;
import com.project.mysell.model.ProductModel;
import com.project.mysell.service.ProductService;
import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping()
    public ResponseEntity<Mono<ProductModel>> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        Mono<ProductModel> newProduct = this.productService.createProduct(productDTO);
        return ResponseEntity.ok().body(newProduct);
    }

    @GetMapping()
    public ResponseEntity<Flux<ProductModel>> getAllProducts() {
        Flux<ProductModel> products  = this.productService.getAllProducts();
        return ResponseEntity.ok().body(products);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mono<ProductModel>> updateProduct (@PathVariable Long id, @RequestBody @Valid ProductDTO productDTO) {
        Mono<ProductModel> updatedProduct  = this.productService.updateProduct(id, productDTO);
        return ResponseEntity.ok().body(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Mono<Void>> deleteProduct (@PathVariable Long id) {
        Mono<Void> deletedProduct = this.productService.deleteProduct(id);
        return ResponseEntity.ok().body(deletedProduct);
    }
}
