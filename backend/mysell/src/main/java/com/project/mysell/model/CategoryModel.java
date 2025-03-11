package com.project.mysell.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.category.CategoryDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("categories")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryModel {
	@Id
	private Long categoriesId;
	private String name;
	public CategoryModel(CategoryDTO categoryDTO) {
		this.name = categoryDTO.name();
	}
}
