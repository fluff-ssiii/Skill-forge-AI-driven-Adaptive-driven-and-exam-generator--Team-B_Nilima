package com.springpro.controller;

import com.springpro.entity.Course;
import com.springpro.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository repository;

    @GetMapping
    public List<Course> getAllCourses() {
        return repository.findAll();
    }

    @GetMapping("/instructor/{instructorId}")
    public List<Course> getCoursesByInstructor(@PathVariable Long instructorId) {
        return repository.findByInstructorId(instructorId);
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return repository.save(course);
    }

    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        Course course = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        course.setTitle(courseDetails.getTitle());
        course.setDifficultyLevel(courseDetails.getDifficultyLevel());
        return repository.save(course);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
