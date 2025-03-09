package com.project.mysell.model;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
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
	private UUID usersId;
	private String email;
	private String password;
	private LocalDateTime created_at;
	private boolean emailValidated;
	private UserRole role;
	public UserModel(UserDTO userDTO) {
		this.email = userDTO.email();
		this.password = userDTO.password();
		this.created_at = LocalDateTime.now();
		this.emailValidated = false; 
		this.role = UserRole.USER ;
	}
}
