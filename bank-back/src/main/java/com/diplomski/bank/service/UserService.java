package com.diplomski.bank.service;

import com.diplomski.bank.exception.ApiRequestException;
import com.diplomski.bank.model.Role;
import com.diplomski.bank.model.Users;
import com.diplomski.bank.model.dto.ResponseDto;
import com.diplomski.bank.model.dto.UserDto;
import com.diplomski.bank.repository.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;

    public ResponseDto<UserDto> createUser(UserDto userDto) {
        Users user = new Users();
        ResponseDto<UserDto> responseDto = new ResponseDto<>();
        try {
            user.setName(userDto.getName());
            user.setEmail(checkIfEmailAlreadyExists(userDto.getEmail()));
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            if (userDto.getRoles() != null && !userDto.getRoles().isEmpty()) {
                List<Role> list = userDto.getRoles().stream()
                        .map(src -> modelMapper.map(src, Role.class))
                        .toList();
                user.setRoles(list);
            }

            Users save = usersRepository.save(user);
            responseDto.setObject(modelMapper.map(save, UserDto.class));

            return responseDto;

        } catch (Exception e) {
            String errorMsg = "Exception occured when creating a user. ";
            log.error(errorMsg, e);
            responseDto.setErrorMessage(errorMsg + e.getMessage());

            return responseDto;
        }
    }

    private String checkIfEmailAlreadyExists(String email) {
        Optional<Users> byEmail = usersRepository.findByEmail(email);

        if (byEmail.isPresent()) {
            throw new ApiRequestException("User with email: " + email + " allready exists!");
        }

        return email;
    }
}
