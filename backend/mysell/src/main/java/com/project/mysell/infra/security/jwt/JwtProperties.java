package com.project.mysell.infra.security.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {
	private String secret = "";
    private final long validityInMs = 3600000; // 1h
}
