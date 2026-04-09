package com.webvibes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webvibes.dto.UpdateStatusRequest;
import com.webvibes.entity.AssessmentStatus;
import com.webvibes.entity.AssessmentType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application.properties")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AdminStudentAssessmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // ─── Authentication guard tests ──────────────────────────────────────────────

    @Test
    void getAllStudentAssessments_withoutAuth_returns403() throws Exception {
        mockMvc.perform(get("/api/admin/student-assessments"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void getAllStudentAssessments_withStudentRole_returns403() throws Exception {
        mockMvc.perform(get("/api/admin/student-assessments"))
                .andExpect(status().isForbidden());
    }

    // ─── GET all student assessments ─────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllStudentAssessments_noFilters_returns200WithList() throws Exception {
        mockMvc.perform(get("/api/admin/student-assessments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllStudentAssessments_filteredByType_returns200() throws Exception {
        mockMvc.perform(get("/api/admin/student-assessments")
                .param("assessmentType", AssessmentType.APTITUDE_TEST.name()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllStudentAssessments_filteredByStatus_returns200() throws Exception {
        mockMvc.perform(get("/api/admin/student-assessments")
                .param("assessmentStatus", AssessmentStatus.PENDING.name()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllStudentAssessments_filteredByTypeAndStatus_returns200() throws Exception {
        mockMvc.perform(get("/api/admin/student-assessments")
                .param("assessmentType", AssessmentType.TECHNICAL_MCQ.name())
                .param("assessmentStatus", AssessmentStatus.COMPLETED.name()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // ─── PUT status update ────────────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateStatus_notFound_returns404() throws Exception {
        UpdateStatusRequest req = new UpdateStatusRequest();
        req.setStatus(AssessmentStatus.COMPLETED);

        mockMvc.perform(put("/api/admin/student-assessments/99999/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound());
    }
}
