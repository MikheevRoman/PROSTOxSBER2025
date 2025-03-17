package ru.sberhack2025.companyevents.common.error;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.sberhack2025.companyevents.common.error.exception.common.BadRequest;
import ru.sberhack2025.companyevents.common.error.exception.common.InternalServerError;
import ru.sberhack2025.companyevents.common.error.exception.common.NotFound;
import ru.sberhack2025.companyevents.common.error.exception.entity.EntityNotFoundException;
import ru.sberhack2025.companyevents.common.error.exception.entity.NotUniqueException;
import ru.sberhack2025.companyevents.common.logs.LogFormatter;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class ErrorHandler implements LogFormatter {

    private ErrorResponse handleError(String error, String message) {
        logError(error, message);
        return new ErrorResponse(error, message);
    }

    private ErrorResponse handleError(HttpStatus status, String message) {
        return handleError(status.getReasonPhrase(), message);
    }

    private ErrorResponse handleError(HttpStatus status, Exception exception) {
        return handleError(status.getReasonPhrase(), exception.getMessage());
    }


    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse notUniqueHandle(final NotUniqueException e) {
        return handleError(HttpStatus.BAD_REQUEST, e);
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse entityNotFoundHandle(final EntityNotFoundException e) {
        return handleError(HttpStatus.NOT_FOUND, e);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse notValidArgumentHandle(final MethodArgumentNotValidException e) {
        List<FieldError> errors = e.getBindingResult().getFieldErrors();
        String errorMessage = errors.stream()
                .map(error -> String.format("[Field: %s, error: %s, value: %s]",
                        error.getField(), error.getDefaultMessage(), error.getRejectedValue()))
                .collect(Collectors.joining(" "));
        return handleError(HttpStatus.BAD_REQUEST, errorMessage);
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse badRequestHandler(final BadRequest e) {
        return handleError(HttpStatus.BAD_REQUEST, e);
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse notFoundHandler(final NotFound e) {
        return handleError(HttpStatus.NOT_FOUND, e);
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse internalServerError(final InternalServerError e) {
        return handleError(HttpStatus.INTERNAL_SERVER_ERROR, e);
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse unexpectedErrorHandle(final Exception e) {
        return handleError(HttpStatus.INTERNAL_SERVER_ERROR, e);
    }

}
