package com.springpro.controller;

import com.springpro.entity.User;
import com.springpro.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", user.getId());
                    userInfo.put("fullName", user.getFullName());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("role", user.getRole());
                    return userInfo;
                })
                .collect(Collectors.toList());
    }

    @DeleteMapping("/users/{id}")
    public Map<String, String> deleteUser(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            response.put("message", "User deleted successfully");
            response.put("status", "success");
        } else {
            response.put("message", "User not found");
            response.put("status", "error");
        }
        return response;
    }
}
