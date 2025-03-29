package ru.sberhack2025.companyevents.common.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ru.sberhack2025.companyevents.common.validation.annotation.ValidEnum;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class EnumValidator implements ConstraintValidator<ValidEnum, String> {
    Set<String> values;
    private String fieldName;


    @Override
    public void initialize(ValidEnum constraintAnnotation) {
        fieldName = constraintAnnotation.fieldName();
        values = Stream.of(constraintAnnotation.enumClass().getEnumConstants())
                .map(Enum::name)
                .collect(Collectors.toSet());
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext context) {
        if (s == null || values.contains(s.toUpperCase())) {
            return true;
        }
        String allowedValues = String.join(", ", values);

        context.disableDefaultConstraintViolation();
        String message = String.format("Invalid %s value. Allowed values: [%s]", fieldName, allowedValues);

        context.buildConstraintViolationWithTemplate(message)
                .addConstraintViolation();
        return false;
    }
}
