package com.example.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 1. DB에 이름 저장하는 API
    @PostMapping("/users")
    public User createUser(@RequestParam String name) {
        User user = new User();
        user.setName(validateName(name));
        return userRepository.save(user);
    }

    // 2. DB에서 목록 가져오는 API
    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAllByOrderByIdAsc();
    }

    // 3. DB에서 이름 수정하는 API
    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestParam String name) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 유저가 없습니다. id=" + id));
        user.setName(validateName(name));
        return userRepository.save(user);
    }

    // 4. DB에서 데이터 삭제하는 API
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 유저가 없습니다. id=" + id));
        userRepository.delete(user);
    }

    private String validateName(String name) {
        String normalizedName = name.trim();
        if (normalizedName.isEmpty() || normalizedName.length() > User.MAX_NAME_LENGTH) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이름은 공백만으로 입력할 수 없으며 1자 이상 100자 이하여야 합니다."
            );
        }
        return normalizedName;
    }
}
