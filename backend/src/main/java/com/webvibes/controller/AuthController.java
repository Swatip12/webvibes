package com.webvibes.controller;
import com.webvibes.dto.JwtAuthResponse;
import com.webvibes.dto.LoginRequest;
import com.webvibes.dto.MessageResponse;
import com.webvibes.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            String token = jwtTokenProvider.generateToken(authentication);
            
            String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_ADMIN");
            
            JwtAuthResponse response = new JwtAuthResponse(
                token,
                authentication.getName(),
                role
            );
            
            return ResponseEntity.ok(response);
            
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401)
                .body(new MessageResponse("Invalid username or password"));
        } catch (Exception e) {
            log.error("Login error for user '{}': {}", loginRequest.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(500)
                .body(new MessageResponse("Error: " + e.getClass().getSimpleName() + ": " + e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageResponse("Logout successful"));
    }
}
