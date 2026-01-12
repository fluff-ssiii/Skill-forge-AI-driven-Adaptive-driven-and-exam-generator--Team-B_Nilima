package com.springpro.exception;

public class QuizAssignedException extends RuntimeException {
    public QuizAssignedException() {
        super("You cannot delete an assigned quiz");
    }
}
