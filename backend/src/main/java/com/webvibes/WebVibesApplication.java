package com.webvibes;
import com.webvibes.repository.AdminUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class WebVibesApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebVibesApplication.class, args);
    }

    // TEMPORARY: Resets admin password to 'admin123' on startup using Spring's own BCrypt encoder.
    // Remove this bean after first successful login.
    @Bean
    public CommandLineRunner resetAdminPassword(AdminUserRepository repo, PasswordEncoder encoder) {
        return args -> {
            try {
                repo.findByUsername("admin").ifPresent(user -> {
                    user.setPassword(encoder.encode("admin123"));
                    repo.save(user);
                    System.out.println(">>> Admin password reset to 'admin123' successfully.");
                });
                if (repo.findByUsername("admin").isEmpty()) {
                    System.out.println(">>> No admin user found — skipping password reset.");
                }
            } catch (Exception e) {
                System.out.println(">>> Admin password reset skipped: " + e.getMessage());
            }
        };
    }
}
