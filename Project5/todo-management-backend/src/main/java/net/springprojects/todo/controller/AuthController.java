package net.springprojects.todo.controller;

import lombok.AllArgsConstructor;
import net.springprojects.todo.dto.LoginDto;
import net.springprojects.todo.dto.LoginResponse;
import net.springprojects.todo.dto.RegisterDto;
import net.springprojects.todo.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        String response = authService.register(registerDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginDto loginDto) {
        LoginResponse loginResponse = authService.login(loginDto);
        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }
}
