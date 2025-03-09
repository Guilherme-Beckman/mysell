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

import com.project.mysell.dto.CategoryDTO;
import com.project.mysell.model.CategoryModel;
import com.project.mysell.service.CategoryService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping()
    public ResponseEntity<Mono<CategoryModel>> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        Mono<CategoryModel> newCategory = this.categoryService.createCategory(categoryDTO);
        return ResponseEntity.ok().body(newCategory);
    }

    @GetMapping()
    public ResponseEntity<Flux<CategoryModel>> getAllCategories() {
        Flux<CategoryModel> categories = this.categoryService.getAllCategories();
        return ResponseEntity.ok().body(categories);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mono<CategoryModel>> updateCategory(@PathVariable Long id, @RequestBody @Valid CategoryDTO categoryDTO) {
        Mono<CategoryModel> updatedCategory = this.categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok().body(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Mono<Void>> deleteCategory(@PathVariable Long id) {
        Mono<Void> deletedCategory = this.categoryService.deleteCategory(id);
        return ResponseEntity.ok().body(deletedCategory);
    }
}
