package com.project.mysell.controller;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.core.annotation.AliasFor;
import org.springframework.test.context.TestPropertySource;

import com.project.mysell.infra.security.CustomReactiveUserDetailsService;
import com.project.mysell.infra.security.SecurityConfiguration;
import com.project.mysell.infra.security.jwt.JwtProperties;
import com.project.mysell.infra.security.jwt.JwtTokenAuthenticationFilter;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.repository.UserRepository;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@WebFluxTest
@Import({
    SecurityConfiguration.class,
    CustomReactiveUserDetailsService.class,
    JwtTokenProvider.class,
    JwtTokenAuthenticationFilter.class,
    JwtProperties.class
})
@TestPropertySource(properties = {
    "jwt.secret=test-secret-12345678901234567890123456789012" // HS256 requires min 256 bits (32 chars)
})
@MockBean(UserRepository.class)
public @interface SecureWebFluxTest {
    @AliasFor(annotation = WebFluxTest.class, attribute = "controllers")
    Class<?>[] controllers() default {};
}