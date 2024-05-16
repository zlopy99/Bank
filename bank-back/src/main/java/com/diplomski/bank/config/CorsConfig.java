package com.diplomski.bank.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/client/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
        registry.addMapping("/api/account/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
        registry.addMapping("/api/auth/**")
                .allowedOrigins("http://localhost:4200")
                .exposedHeaders("access_token", "refresh_token")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
