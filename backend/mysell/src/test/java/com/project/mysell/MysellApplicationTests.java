package com.project.mysell;

import com.project.mysell.model.UserModel;
import com.project.mysell.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class MysellApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSaveAndFindByEmail() {
        // Cria um novo usuário
        UserModel user = new UserModel();
        user.setEmail("teste@exemplo.com");
        user.setPassword("senha123");

        // Salva o usuário de forma reativa
        StepVerifier.create(userRepository.save(user))
            .assertNext(savedUser -> {
                assertNotNull(savedUser.getId(), "O ID não deve ser nulo");
                assertEquals("teste@exemplo.com", savedUser.getEmail(), "O email deve ser o mesmo");
            })
            .verifyComplete();

        // Busca o usuário pelo email de forma reativa
        StepVerifier.create(userRepository.findByEmail("teste@exemplo.com"))
            .assertNext(foundUser -> {
                assertEquals("teste@exemplo.com", foundUser.getEmail(), "O email deve ser o mesmo");
            })
            .verifyComplete();
    }
}
