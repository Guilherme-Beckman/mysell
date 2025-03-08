package com.project.mysell.infra.security.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;
import javax.crypto.SecretKey;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import com.project.mysell.infra.security.CustomUserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
	private static final String AUTHORITIES_KEY = "role";
	private final JwtProperties jwtProperties;
	private SecretKey secretKey;
	@PostConstruct
	public void init() {
	
		var secret = Base64.getEncoder()
				.encodeToString(this.jwtProperties.getSecret().getBytes());
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}
	
	 public String createToken(Authentication authentication) {
		 if(authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
			CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        String username = authentication.getName();
	        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
	        Claims claims = Jwts.claims().setSubject(username);
	        claims.put("userId", userDetails.getUsersId());
	        if (!authorities.isEmpty()) {
	            String authoritiesString = authorities.stream()
	                    .map(GrantedAuthority::getAuthority)
	                    .collect(Collectors.joining(","));
	            claims.put(AUTHORITIES_KEY, authoritiesString);
	        }

	        Date now = new Date();
	        Date validity = new Date(now.getTime() + this.jwtProperties.getValidityInMs());
	        String token = Jwts.builder()
	                .setClaims(claims)
	                .setIssuedAt(now)
	                .setExpiration(validity)
	                .signWith(this.secretKey, SignatureAlgorithm.HS256)
	                .compact();
	        return token;
	    }
		 return null;
	 }
	
    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(this.secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        Object authoritiesClaim = claims.get(AUTHORITIES_KEY);
        Collection<? extends GrantedAuthority> authorities = authoritiesClaim == null
                ? AuthorityUtils.NO_AUTHORITIES
                : AuthorityUtils.commaSeparatedStringToAuthorityList(authoritiesClaim.toString());
        User principal = new User(claims.getSubject(), "", authorities);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, token, authorities);
        return authentication;
    }
	public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(this.secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
        } catch (IllegalArgumentException e) {
        } catch (Exception e) {
        }
        return false;
    }
	
	public String createTokenFromOAuth2(Authentication authentication) {
		OAuth2AuthenticationToken auth2AuthenticationToken  = (OAuth2AuthenticationToken) authentication;
		OAuth2User auth2User =  auth2AuthenticationToken.getPrincipal();
		String username = auth2User.getAttribute("email");
		Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
		Claims claims = Jwts.claims().setSubject(username);
		
		if(!authorities.isEmpty()) {
			claims.put(AUTHORITIES_KEY, authorities.stream().map(GrantedAuthority::getAuthority)
					.collect(Collectors.joining(",")));
		}
		Date now = new Date();
		Date validity = new Date(now.getTime()+ this.jwtProperties.getValidityInMs());
		
        return Jwts.builder()
        		.setClaims(claims)
        		.setIssuedAt(now)
        		.setExpiration(validity)
                .signWith(this.secretKey, SignatureAlgorithm.HS256).compact();
	}
    public String extractJwtToken(String authorizationHeader) {
        return authorizationHeader.substring(7);
}
}