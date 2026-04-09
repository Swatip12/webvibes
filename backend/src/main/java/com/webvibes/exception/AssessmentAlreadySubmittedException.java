package com.webvibes.exception;

public class AssessmentAlreadySubmittedException extends RuntimeException {
    public AssessmentAlreadySubmittedException(String message) {
        super(message);
    }
}
