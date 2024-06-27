package com.diplomski.bank.service;

import com.diplomski.bank.exception.ApiRequestException;
import com.diplomski.bank.model.AccountLog;
import com.diplomski.bank.model.ClientLog;
import com.diplomski.bank.model.Role;
import com.diplomski.bank.model.Users;
import com.diplomski.bank.model.dto.ClientAccountLogDto;
import com.diplomski.bank.model.dto.ResponseDto;
import com.diplomski.bank.model.dto.UserDto;
import com.diplomski.bank.repository.AccountLogRepository;
import com.diplomski.bank.repository.ClientLogRepository;
import com.diplomski.bank.repository.UsersRepository;
import com.diplomski.bank.util.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;


@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;
    private final ClientLogRepository clientLogRepository;
    private final AccountLogRepository accountLogRepository;

    public ResponseDto<UserDto> createUser(UserDto userDto, MultipartFile file) {
        Users user = new Users();
        ResponseDto<UserDto> responseDto = new ResponseDto<>();
        try {
            user.setName(userDto.getName());
            user.setEmail(checkIfEmailAlreadyExists(userDto.getEmail()));
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            setImageForUser(user, file);
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

    private void setImageForUser(Users user, MultipartFile file) throws IOException {
        if (file == null) {
            Resource resource = new ClassPathResource("images/blank.png");
            InputStream inputStream = resource.getInputStream();
            byte[] bytes = inputStream.readAllBytes();
            user.setImage(UserUtil.compressImage(bytes));
            user.setImageName("blank");

        } else {
            user.setImageName(file.getOriginalFilename() != null
                    ? file.getOriginalFilename().split("\\.")[0]
                    : null);
            user.setImage(UserUtil.compressImage(file.getBytes()));
        }
    }

    private String checkIfEmailAlreadyExists(String email) {
        Optional<Users> byEmail = usersRepository.findByEmail(email);

        if (byEmail.isPresent()) {
            throw new ApiRequestException("User with email: " + email + " allready exists!");
        }

        return email;
    }

    public List<UserDto> getAllUsers(String inputValue) {
        String inputValueLike = "null".equals(inputValue) ? "" : inputValue;
        List<Users> allUsers = usersRepository.findAllLikeInputValue(inputValueLike, PageRequest.of(0, 20));

        if (allUsers.isEmpty())
            return Collections.emptyList();

        return allUsers.stream()
                .map(src -> {
                    String imageBase64 = null;
                    if (src.getImage() != null)
                        imageBase64 = Base64.getEncoder().encodeToString(UserUtil.decompressImage(src.getImage()));
                    UserDto map = modelMapper.map(src, UserDto.class);
                    map.setPassword(null);
                    map.setImage(imageBase64);
                    return map;
                })
                .toList();
    }

    public UserDto getUser(Long id) {
        Users userById = usersRepository.findById(id)
                .orElseThrow(() -> new ApiRequestException("User with that ID does not exist."));

        try {
            UserDto userDto = modelMapper.map(userById, UserDto.class);
            userDto.setPassword(null);
            if (userById.getImage() != null)
                userDto.setImage(Base64.getEncoder().encodeToString(UserUtil.decompressImage(userById.getImage())));

            return userDto;

        } catch (Exception e) {
            String errMsg = "Exception when retriving user details. ";
            log.error(errMsg, e);
            throw new ApiRequestException(errMsg + e.getMessage());
        }
    }

    public UserDto editUser(UserDto userDto, MultipartFile file) {
        try {
            Users user = usersRepository.findById(userDto.getId())
                            .orElseThrow(() -> new ApiRequestException("User not found"));
            user.setName(userDto.getName());
            if (!userDto.getEmail().equalsIgnoreCase(user.getEmail()))
                user.setEmail(checkIfEmailAlreadyExists(userDto.getEmail()));
            if (userDto.getPassword() != null)
                user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            if (UserUtil.DELETE_IMAGE.equals(userDto.getImageName()) || file != null)
                setImageForUser(user, file);
            if (userDto.getRoles() != null && !userDto.getRoles().isEmpty()) {
                user.getRoles().clear();
                userDto.getRoles().stream()
                        .map(src -> modelMapper.map(src, Role.class))
                        .forEach(role -> user.getRoles().add(role));
            }

            Users save = usersRepository.save(user);
            String imageBase64 = Base64.getEncoder().encodeToString(UserUtil.decompressImage(save.getImage()));

            UserDto map = modelMapper.map(save, UserDto.class);
            map.setImage(imageBase64);

            return map;

        } catch (Exception e) {
            String errorMsg = "Exception occured when creating a user. ";
            log.error(errorMsg, e);
            throw new ApiRequestException(errorMsg + e.getMessage());
        }
    }

    public List<ClientAccountLogDto.ClientLogDto> getLogDataClient(String email) {
        try {
            List<ClientLog> clientLogs = clientLogRepository.findByUserEmail(email);
            return clientLogs.stream()
                    .map(src -> modelMapper.map(src, ClientAccountLogDto.ClientLogDto.class))
                    .toList();

        } catch (Exception e) {
            String errMsg = "Exception when retriving client logs for user. ";
            log.error(errMsg, e);
            throw new ApiRequestException(errMsg + e.getMessage());
        }
    }

    public List<ClientAccountLogDto.AccountLogDto> getLogDataAccount(String email) {
        try {
            List<AccountLog> accountLogs = accountLogRepository.findByUserEmail(email);
            return accountLogs.stream()
                    .map(src -> modelMapper.map(src, ClientAccountLogDto.AccountLogDto.class))
                    .toList();

        } catch (Exception e) {
            String errMsg = "Exception when retriving account logs for user. ";
            log.error(errMsg, e);
            throw new ApiRequestException(errMsg + e.getMessage());
        }
    }
}