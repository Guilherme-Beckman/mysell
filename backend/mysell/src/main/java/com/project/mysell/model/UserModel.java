package com.project.mysell.model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.security.config.annotation.authentication.configurers.userdetails.UserDetailsAwareConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.project.mysell.dto.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("users")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserModel{
	@Id
	private UUID id;
	private String email;
	private String password;
	private LocalDateTime created_at;
	
	
	public UserModel (UserDTO userDTO) {
		this.email = userDTO.email();
		this.password = userDTO.password();
		this.created_at = LocalDateTime.now();
	}
}
