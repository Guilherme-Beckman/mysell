package com.project.mysell.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.CategoryDTO;
import com.project.mysell.exceptions.CategoryNotFoundException;
import com.project.mysell.model.CategoryModel;
import com.project.mysell.repository.CategoryRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CategoryService {

	@Autowired
	private CategoryRepository categoryRepository;

	public Mono<CategoryModel> createCategory(CategoryDTO categoryDTO) {
		CategoryModel categoryModel = new CategoryModel(categoryDTO);
		return this.categoryRepository.save(categoryModel);
	}

	public Flux<CategoryModel> getAllCategories() {
		return this.categoryRepository.findAll();
	}
	public Mono<CategoryModel> getCategoryById(Long id) {
		return this.categoryRepository.findById(id);
	}


	public Mono<CategoryModel> updateCategory(Long id, CategoryDTO categoryDTO) {
		return this.categoryRepository.findById(id).flatMap(category -> {
			category.setName(categoryDTO.name());
			return this.categoryRepository.save(category);
		}).switchIfEmpty(Mono.error(new CategoryNotFoundException()));
	}

	public Mono<Void> deleteCategory(Long id) {
		return this.categoryRepository.findById(id).switchIfEmpty(Mono.error(new CategoryNotFoundException()))
				.flatMap(category -> {
					return this.categoryRepository.deleteById(id);
				});

	}
}
