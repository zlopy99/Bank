package com.diplomski.bank.security;

import com.diplomski.bank.service.MyUserDetailService;
import com.diplomski.bank.util.RolesEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final MyUserDetailService myUserDetailService;
    private final JwtAuthFilter jwtAuthFilter;
    private final ExceptionHandlingFilter exceptionHandlingFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(registry -> {
                    registry.requestMatchers(
                            "/api/auth/login",
                            "/api/auth/refreshToken",
                            "/api/client/firstFive",
                            "/api/client/lastWeekClients",
                            "/api/client/yearlyClients",
                            "/api/account/lastMonthAccounts"
                    ).permitAll();
                    registry.requestMatchers(
                            HttpMethod.GET,
                            "/api/client/details/**",
                            "/api/client/countries/**"
                    ).hasAnyAuthority(
                            RolesEnum.ADMIN.getName(),
                            RolesEnum.BANKER_OBSERVE.getName(),
                            RolesEnum.BANKER_CLIENT.getName(),
                            RolesEnum.BANKER_ACCOUNT.getName()
                    );
                    registry.requestMatchers("/api/client/**").hasAnyAuthority(
                            RolesEnum.ADMIN.getName(),
                            RolesEnum.BANKER_OBSERVE.getName(),
                            RolesEnum.BANKER_CLIENT.getName()
                    );
                    registry.requestMatchers("/api/account/**").hasAnyAuthority(
                            RolesEnum.ADMIN.getName(),
                            RolesEnum.BANKER_OBSERVE.getName(),
                            RolesEnum.BANKER_ACCOUNT.getName()
                    );
                    registry.requestMatchers("/api/user/**").hasAuthority(RolesEnum.ADMIN.getName());
                    registry.anyRequest().authenticated();
                })
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(exceptionHandlingFilter, JwtAuthFilter.class)
                .build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return myUserDetailService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        final DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService());
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return daoAuthenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
