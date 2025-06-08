package com.example.back_end.controller;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.FavoriteResponseDTO;
import com.example.back_end.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Slf4j
public class FavoriteController {
    private final FavoriteService favoriteService;

    @GetMapping("/user/{userId}")
    public ApiResponse<List<FavoriteResponseDTO>> getUserFavorites(@PathVariable Integer userId) {
        try {
            List<FavoriteResponseDTO> favorites = favoriteService.getUserFavorites(userId);
            return ApiResponse.<List<FavoriteResponseDTO>>builder()
                    .code(200)
                    .message("Success")
                    .result(favorites)
                    .build();
        } catch (Exception e) {
            log.error("Error getting user favorites: ", e);
            return ApiResponse.<List<FavoriteResponseDTO>>builder()
                    .code(500)
                    .message("Error getting user favorites")
                    .build();
        }
    }

    @PostMapping("/user/{userId}/course/{courseId}")
    public ApiResponse<FavoriteResponseDTO> addToFavorites(
            @PathVariable Integer userId,
            @PathVariable Integer courseId) {
        try {
            FavoriteResponseDTO favorite = favoriteService.addToFavorites(userId, courseId);
            return ApiResponse.<FavoriteResponseDTO>builder()
                    .code(200)
                    .message("Success")
                    .result(favorite)
                    .build();
        } catch (Exception e) {
            log.error("Error adding to favorites: ", e);
            return ApiResponse.<FavoriteResponseDTO>builder()
                    .code(500)
                    .message("Error adding to favorites")
                    .build();
        }
    }

    @DeleteMapping("/user/{userId}/course/{courseId}")
    public ApiResponse<Void> removeFromFavorites(
            @PathVariable Integer userId,
            @PathVariable Integer courseId) {
        try {
            favoriteService.removeFromFavorites(userId, courseId);
            return ApiResponse.<Void>builder()
                    .code(200)
                    .message("Success")
                    .build();
        } catch (Exception e) {
            log.error("Error removing from favorites: ", e);
            return ApiResponse.<Void>builder()
                    .code(500)
                    .message("Error removing from favorites")
                    .build();
        }
    }
} 