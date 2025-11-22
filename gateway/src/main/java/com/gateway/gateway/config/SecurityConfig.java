package com.gateway.gateway.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import org.bouncycastle.asn1.ASN1Primitive;
import org.bouncycastle.asn1.pkcs.RSAPrivateKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPrivateCrtKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${jwt.private.key}")
    private Resource privateKeyResource;

    @Value("${jwt.public.key}")
    private Resource publicKeyResource;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // Swagger - liberar tudo
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/v3/api-docs.yaml")
                        .permitAll()

                        // MUITO IMPORTANTE → swagger e browser usam OPTIONS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Liberar registro e login
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()

                        // Tudo o resto exige token
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt());

        return http.build();
    }

    @Bean
    public java.security.interfaces.RSAPrivateKey privateKey() throws Exception {
        String keyContent = new String(privateKeyResource.getInputStream().readAllBytes(),
                StandardCharsets.UTF_8)
                .replaceAll("-----BEGIN (.*)PRIVATE KEY-----", "")
                .replaceAll("-----END (.*)PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");

        byte[] keyBytes = Base64.getDecoder().decode(keyContent);

        try {
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
            return (java.security.interfaces.RSAPrivateKey) KeyFactory.getInstance("RSA")
                    .generatePrivate(keySpec);
        } catch (Exception e) {
            RSAPrivateKey bcKey = RSAPrivateKey.getInstance(ASN1Primitive.fromByteArray(keyBytes));
            RSAPrivateCrtKeySpec keySpec = new RSAPrivateCrtKeySpec(
                    bcKey.getModulus(),
                    bcKey.getPublicExponent(),
                    bcKey.getPrivateExponent(),
                    bcKey.getPrime1(),
                    bcKey.getPrime2(),
                    bcKey.getExponent1(),
                    bcKey.getExponent2(),
                    bcKey.getCoefficient());
            return (java.security.interfaces.RSAPrivateKey) KeyFactory.getInstance("RSA")
                    .generatePrivate(keySpec);
        }
    }

    @Bean
    public RSAPublicKey publicKey() throws Exception {
        String keyContent = new String(publicKeyResource.getInputStream().readAllBytes(),
                StandardCharsets.UTF_8)
                .replaceAll("-----BEGIN (.*)PUBLIC KEY-----", "")
                .replaceAll("-----END (.*)PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(Base64.getDecoder().decode(keyContent));
        return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(keySpec);
    }

    @Bean
    JwtDecoder jwtDecoder(RSAPublicKey publicKey) {
        return NimbusJwtDecoder.withPublicKey(publicKey).build();
    }

    @Bean
    JwtEncoder jwtEncoder(RSAPublicKey publicKey, java.security.interfaces.RSAPrivateKey privateKey) {
        var jwk = new RSAKey.Builder(publicKey).privateKey(privateKey).build();
        var jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
