package ru.sberhack2025.companyevents.common.formatter;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public interface DateFormatter {


    String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm";
    DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(DATE_TIME_PATTERN);

    String DATE_PATTERN = "yyyy-MM-dd";
    DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(DATE_PATTERN);

    String TIME_PATTERN = "HH:mm";
    DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern(TIME_PATTERN);

    String INSTANT_PATTERN = "yyyy-MM-dd'T'HH:mm:ss'Z'";
    DateTimeFormatter INSTANT_FORMATTER = DateTimeFormatter.ofPattern(INSTANT_PATTERN).withZone(ZoneId.of("UTC"));

}
