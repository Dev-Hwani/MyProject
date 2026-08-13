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

    // DB에 이름 저장하는 API
    @PostMapping("/users")
    public User createUser(@RequestParam String name) {
        User user = new User();
        user.setName(name);
        return userRepository.save(user);
    }

    // DB에서 목록 가져오는 API
    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }
}
