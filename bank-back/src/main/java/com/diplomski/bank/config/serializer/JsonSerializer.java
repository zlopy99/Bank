package com.diplomski.bank.config.serializer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;

import java.io.IOException;
import java.time.LocalDate;

public class JsonSerializer<T> implements RedisSerializer<T> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public byte[] serialize(T obj) throws SerializationException {
        try {
            objectMapper.registerModule(new SimpleModule().addSerializer(LocalDate.class, new CustomDateSerializer()));
            return objectMapper.writeValueAsBytes(obj);
        } catch (JsonProcessingException e) {
            throw new SerializationException("Error serializing object to JSON", e);
        }
    }

    @Override
    public T deserialize(byte[] bytes) throws SerializationException {
        if (bytes == null || bytes.length == 0) {
            return null;
        }
        try {
            objectMapper.registerModule(new SimpleModule().addDeserializer(LocalDate.class, new CustomDateDeserializer()));
            return objectMapper.readValue(bytes, objectMapper.constructType(Object.class));
        } catch (IOException e) {
            throw new SerializationException("Error deserializing JSON to object", e);
        }
    }
}
