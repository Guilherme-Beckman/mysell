package com.project.mysell.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.category.CategoryDTO;
import com.project.mysell.exceptions.category.CategoryNotFoundException;
import com.project.mysell.model.BrickCodeModel;
import com.project.mysell.model.CategoryModel;
import com.project.mysell.repository.BrickCodeRepository;
import com.project.mysell.repository.CategoryRepository;

import jakarta.annotation.PostConstruct;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CategoryService {

	@Autowired
	private CategoryRepository categoryRepository;
	  private Flux<CategoryDTO> cachedFlux;
	@Autowired
	private BrickCodeRepository brickCodeRepository;
	@PostConstruct
	public void init () {
		this.cachedFlux = 
			    this.getAllCategories()
			        .map(unit -> new CategoryDTO(unit.getName(), unit.getGpcCode()))
			        .cache();
	}
	public Mono<CategoryModel> createCategory(CategoryDTO categoryDTO) {
		CategoryModel categoryModel = new CategoryModel(categoryDTO);
		return this.categoryRepository.save(categoryModel);
	}

	public Flux<CategoryModel> getAllCategories() {
		return this.categoryRepository.findAll();
	}
	public Mono<CategoryModel> getCategoryById(Long id) {
		return this.categoryRepository.findById(id)
				.switchIfEmpty(Mono.error(new CategoryNotFoundException()));
	}
	public Mono<CategoryModel> getCategoryByGpcCode(Long code) {
		return this.categoryRepository.findByGpcCode(code)
				.switchIfEmpty(Mono.error(new CategoryNotFoundException()));
	}


	public Mono<CategoryModel> updateCategory(Long id, CategoryDTO categoryDTO) {
		return getCategoryById(id).flatMap(category -> {
			category.setName(categoryDTO.name());
			return this.categoryRepository.save(category);
		});
	}

	public Mono<Void> deleteCategory(Long id) {
		return getCategoryById(id)
				.flatMap(category -> {
					return this.categoryRepository.deleteById(id);
				});

	}
	public Mono<List<CategoryDTO>> getListCategories() {
	    return cachedFlux.collectList();
	}
	public Mono<BrickCodeModel> getBrickCodeModel(Long id){
		return this.brickCodeRepository.findById(id)
				.switchIfEmpty(Mono.error(new CategoryNotFoundException()));
	}
}
