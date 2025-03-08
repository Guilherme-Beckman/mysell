package com.project.mysell.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import com.project.mysell.model.CategoryModel;

public interface CategoryRepository extends ReactiveCrudRepository<CategoryModel, Long>{

}
