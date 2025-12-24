package com.springpro.controller;

import com.springpro.entity.Topic;
import com.springpro.repository.TopicRepository;
import com.springpro.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "*")
public class TopicController {

    @Autowired
    private TopicRepository repository;

    @Autowired
    private FileStorageService fileStorageService;

    private String normalizePath(String path) {
        if (path == null || path.isEmpty()) {
            return path;
        }

        // Normalize any Windows separators to forward slashes so we can safely parse paths that
        // were stored as absolute "C:\\...\\uploads\\..." values in older records.
        String cleaned = path.replace("\\", "/");

        // If the path contains an uploads folder, strip everything before it so we keep only the
        // relative portion under uploads (covers absolute paths and double prefixes).
        int uploadsIdx = cleaned.indexOf("uploads/");
        if (uploadsIdx >= 0) {
            cleaned = cleaned.substring(uploadsIdx);
        }

        // Ensure we always start from "/uploads/" regardless of the original format.
        if (cleaned.startsWith("/uploads/")) {
            return cleaned;
        }
        if (cleaned.startsWith("uploads/")) {
            return "/" + cleaned;
        }
        if (cleaned.startsWith("videos/") || cleaned.startsWith("pdfs/")) {
            return "/uploads/" + cleaned;
        }

        // Fallback: just prefix with uploads so the static handler can locate the file.
        return "/uploads/" + cleaned.replaceFirst("^/+", "");
    }

    @GetMapping
    public List<Topic> getAllTopics() {
        List<Topic> topics = repository.findAll();
        topics.forEach(t -> {
            t.setVideoUrl(normalizePath(t.getVideoUrl()));
            t.setPdfUrl(normalizePath(t.getPdfUrl()));
        });
        return topics;
    }

    @GetMapping("/subject/{subjectId}")
    public List<Topic> getTopicsBySubject(@PathVariable Long subjectId) {
        List<Topic> topics = repository.findBySubjectId(subjectId);
        topics.forEach(t -> {
            t.setVideoUrl(normalizePath(t.getVideoUrl()));
            t.setPdfUrl(normalizePath(t.getPdfUrl()));
        });
        return topics;
    }

    // Debug helper to inspect stored URLs quickly during troubleshooting.
    @GetMapping("/debug/urls")
    public List<Map<String, String>> getDebugUrls() {
        return repository.findAll().stream().map(t -> Map.of(
                "id", String.valueOf(t.getId()),
                "title", t.getTitle(),
                "videoUrl", String.valueOf(normalizePath(t.getVideoUrl())),
                "pdfUrl", String.valueOf(normalizePath(t.getPdfUrl()))
        )).collect(Collectors.toList());
    }

    @PostMapping
    public Topic createTopic(
            @RequestParam Long subjectId,
            @RequestParam String title,
            @RequestParam(required = false) String externalLink,
            @RequestParam(required = false) MultipartFile video,
            @RequestParam(required = false) MultipartFile pdf) throws IOException {
        Topic topic = new Topic();
        topic.setSubjectId(subjectId);
        topic.setTitle(title);
        topic.setExternalLink(externalLink);

        if (video != null && !video.isEmpty()) {
            String videoUrl = fileStorageService.saveFile(video, "videos");
            topic.setVideoUrl(normalizePath(videoUrl));
        }

        if (pdf != null && !pdf.isEmpty()) {
            String pdfUrl = fileStorageService.saveFile(pdf, "pdfs");
            topic.setPdfUrl(normalizePath(pdfUrl));
        }

        return repository.save(topic);
    }

    @PutMapping("/{id}")
    public Topic updateTopic(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam(required = false) String externalLink,
            @RequestParam(required = false) MultipartFile video,
            @RequestParam(required = false) MultipartFile pdf) throws IOException {
        Topic topic = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));

        topic.setTitle(title);
        topic.setExternalLink(externalLink);

        if (video != null && !video.isEmpty()) {
            // Delete old video if exists
            if (topic.getVideoUrl() != null) {
                fileStorageService.deleteFile(topic.getVideoUrl());
            }
            String videoUrl = fileStorageService.saveFile(video, "videos");
            topic.setVideoUrl(normalizePath(videoUrl));
        }

        if (pdf != null && !pdf.isEmpty()) {
            // Delete old PDF if exists
            if (topic.getPdfUrl() != null) {
                fileStorageService.deleteFile(topic.getPdfUrl());
            }
            String pdfUrl = fileStorageService.saveFile(pdf, "pdfs");
            topic.setPdfUrl(normalizePath(pdfUrl));
        }

        return repository.save(topic);
    }

    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable Long id) throws IOException {
        Topic topic = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));

        // Delete associated files
        if (topic.getVideoUrl() != null) {
            fileStorageService.deleteFile(topic.getVideoUrl());
        }
        if (topic.getPdfUrl() != null) {
            fileStorageService.deleteFile(topic.getPdfUrl());
        }

        repository.deleteById(id);
    }
}
