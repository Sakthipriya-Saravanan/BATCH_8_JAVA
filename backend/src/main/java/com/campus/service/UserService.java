package com.campus.service;

import com.campus.dto.UserRequest;
import com.campus.dto.UserResponse;
import com.campus.entity.User;
import com.campus.exception.DuplicateResourceException;
import com.campus.exception.ResourceNotFoundException;
import com.campus.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse createUser(UserRequest request) {
        // Check for duplicate email
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new DuplicateResourceException("A user with email '" + request.getEmail() + "' already exists.");
        });

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(User.Role.valueOf(request.getRole()));
        user.setStatus(User.Status.valueOf(request.getStatus()));

        return new UserResponse(userRepository.save(user));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getUsersByStatus(String status) {
        User.Status userStatus = User.Status.valueOf(status);
        return userRepository.findByStatus(userStatus).stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new UserResponse(user);
    }

    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Check for duplicate email (if changed)
        if (!user.getEmail().equals(request.getEmail())) {
            userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
                throw new DuplicateResourceException("A user with email '" + request.getEmail() + "' already exists.");
            });
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(User.Role.valueOf(request.getRole()));
        user.setStatus(User.Status.valueOf(request.getStatus()));

        return new UserResponse(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public long count() {
        return userRepository.count();
    }
}
