package com.webvibes.controller;

import com.webvibes.dto.ContactMessageDTO;
import com.webvibes.dto.MessageResponse;
import com.webvibes.service.ContactService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for handling contact form submissions.
 * Provides endpoints for students to send contact messages.
 */
@RestController
@RequestMapping("/api/contact")
public class ContactController {
    
    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
    
    private final ContactService contactService;
    
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }
    
    /**
     * Handles contact form submissions.
     * 
     * @param dto the contact message data with validation
     * @return ResponseEntity with HTTP 201 and success message on success
     */
    @PostMapping
    public ResponseEntity<MessageResponse> submitContactForm(@Valid @RequestBody ContactMessageDTO dto) {
        logger.info("Received contact form submission from: {}", dto.getName());
        
        contactService.saveMessage(dto);
        
        logger.info("Contact message processed successfully from: {}", dto.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Message sent successfully"));
    }
}
