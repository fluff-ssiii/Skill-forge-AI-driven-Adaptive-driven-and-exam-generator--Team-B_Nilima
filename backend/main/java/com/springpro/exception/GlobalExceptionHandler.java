package com.springpro.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(QuizAssignedException.class)
    public ResponseEntity<?> handleQuizAssigned() {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", "You cannot delete an assigned quiz"));
    }
}
