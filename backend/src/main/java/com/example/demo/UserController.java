package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*") // 프론트엔드(React) CORS 방지
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 1. DB에 이름 저장하는 API
    @PostMapping("/users")
    public User createUser(@RequestParam String name) {
        User user = new User();
        user.setName(name);
        return userRepository.save(user);
    }

    // 2. DB에서 목록 가져오는 API
    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    // 3. DB에서 이름 수정하는 API
    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestParam String name) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다. id=" + id));
        user.setName(name);
        return userRepository.save(user);
    }

    // 4. DB에서 데이터 삭제하는 API
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
