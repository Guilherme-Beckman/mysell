package com.project.mysell.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("users")
public class UserModel {
	@Id
	private UUID userId;
	private String email;
	private String password;
	private LocalDateTime created_at;
	
}
