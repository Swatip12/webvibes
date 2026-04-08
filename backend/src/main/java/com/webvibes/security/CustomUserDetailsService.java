package com.webvibes.security;

import com.webvibes.entity.AdminUser;
import com.webvibes.entity.Student;
import com.webvibes.repository.AdminUserRepository;
import com.webvibes.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

@Service
@Primary
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try admin lookup first (by username)
        Optional<AdminUser> adminOpt = adminUserRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            AdminUser adminUser = adminOpt.get();
            Set<GrantedAuthority> authorities = Collections.singleton(
                    new SimpleGrantedAuthority(adminUser.getRole())
            );
            return new User(adminUser.getUsername(), adminUser.getPassword(), authorities);
        }

        // Fall back to student lookup (by email)
        Optional<Student> studentOpt = studentRepository.findByEmail(username);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            Set<GrantedAuthority> authorities = Collections.singleton(
                    new SimpleGrantedAuthority(student.getRole())
            );
            return new User(student.getEmail(), student.getPassword(), authorities);
        }

        throw new UsernameNotFoundException("User not found: " + username);
    }
}
