package com.webvibes.service;

import com.webvibes.dto.ContactMessageDTO;
import com.webvibes.entity.ContactMessage;
import com.webvibes.repository.ContactRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ContactService {
    
    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);
    
    private final ContactRepository contactRepository;
    
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }
    
    /**
     * Saves a contact message by converting DTO to entity and persisting to database.
     * 
     * @param dto the contact message data transfer object
     * @return the saved ContactMessage entity
     * @throws RuntimeException if database operation fails
     */
    public ContactMessage saveMessage(ContactMessageDTO dto) {
        try {
            logger.info("Processing contact message from: {}", dto.getName());
            
            // Convert DTO to entity
            ContactMessage message = new ContactMessage();
            message.setName(dto.getName());
            message.setEmail(dto.getEmail());
            message.setMessage(dto.getMessage());
            message.setSubmittedAt(LocalDateTime.now());
            message.setIsRead(false);
            
            // Save to repository
            ContactMessage saved = contactRepository.save(message);
            
            logger.info("Contact message saved successfully with ID: {}", saved.getId());
            return saved;
            
        } catch (DataAccessException ex) {
            logger.error("Database error while saving contact message from: {}", 
                        dto.getName(), ex);
            throw new RuntimeException("Failed to save contact message", ex);
        } catch (Exception ex) {
            logger.error("Unexpected error while saving contact message from: {}", 
                        dto.getName(), ex);
            throw new RuntimeException("An unexpected error occurred while processing the message", ex);
        }
    }
}
