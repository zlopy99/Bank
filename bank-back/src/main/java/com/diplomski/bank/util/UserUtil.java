package com.diplomski.bank.util;

import com.diplomski.bank.exception.ApiRequestException;

import java.io.ByteArrayOutputStream;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

public class UserUtil {
    public static final String DELETE_IMAGE = "DELETE";

    private UserUtil() {}

    public static byte[] compressImage(byte[] data) {
        Deflater deflater = new Deflater();
        deflater.setLevel(Deflater.BEST_COMPRESSION);
        deflater.setInput(data);
        deflater.finish();

        try(ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length)) {
            byte[] temp = new byte[4 * 1024];
            while (!deflater.finished()) {
                int size = deflater.deflate(temp);
                outputStream.write(temp, 0, size);
            }

            deflater.end();
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new ApiRequestException("Something went bad with compression. ");
        }
    }

    public static byte[] decompressImage(byte[] data) {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        try(ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length)) {
            byte[] temp = new byte[4 * 1024];

            while (!inflater.finished()) {
                int count = inflater.inflate(temp);
                outputStream.write(temp, 0, count);
            }

            inflater.end();
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new ApiRequestException("Something went bad with decompression. ");
        }
    }
}
