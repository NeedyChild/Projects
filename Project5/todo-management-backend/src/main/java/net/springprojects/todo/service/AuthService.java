package net.springprojects.todo.service;

import net.springprojects.todo.dto.LoginDto;
import net.springprojects.todo.dto.LoginResponse;
import net.springprojects.todo.dto.RegisterDto;

public interface AuthService {
    String register(RegisterDto registerDto);
    LoginResponse login(LoginDto loginDto);
}
