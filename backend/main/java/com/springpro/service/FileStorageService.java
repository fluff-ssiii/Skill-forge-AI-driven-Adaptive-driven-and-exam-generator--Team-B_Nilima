package com.springpro.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    public String saveFile(MultipartFile file, String type) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, type);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return a URL path that frontend can directly prepend with server origin
        return "/uploads/" + type + "/" + filename;
    }

    public void deleteFile(String fileUrl) throws IOException {
        if (fileUrl != null && !fileUrl.isEmpty()) {
            // fileUrl is like /uploads/videos/<name> -> strip the leading /uploads/
            String relative = fileUrl.startsWith("/uploads/") ? fileUrl.substring("/uploads/".length()) : fileUrl;
            Path filePath = Paths.get(uploadDir, relative);
            Files.deleteIfExists(filePath);
        }
    }
}
