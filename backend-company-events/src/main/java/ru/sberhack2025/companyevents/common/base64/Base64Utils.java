package ru.sberhack2025.companyevents.common.base64;

import java.nio.ByteBuffer;
import java.util.Base64;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
public class Base64Utils {

    public static String encodeUUID(UUID uuid) {
        ByteBuffer byteBuffer = ByteBuffer.wrap(new byte[16]);
        byteBuffer.putLong(uuid.getMostSignificantBits());
        byteBuffer.putLong(uuid.getLeastSignificantBits());
        return Base64.getUrlEncoder().withoutPadding().encodeToString(byteBuffer.array());
    }

    public static UUID decodeUUID(String base64) {
        byte[] decodedBytes = Base64.getUrlDecoder().decode(base64);
        ByteBuffer byteBuffer = ByteBuffer.wrap(decodedBytes);
        long mostSignificantBits = byteBuffer.getLong();
        long leastSignificantBits = byteBuffer.getLong();
        return new UUID(mostSignificantBits, leastSignificantBits);
    }
    
}