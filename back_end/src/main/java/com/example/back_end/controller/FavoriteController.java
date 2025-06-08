package com.example.back_end.controller;

import com.example.back_end.dto.CourseDto;
import com.example.back_end.dto.request.FavoriteRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Course;
import com.example.back_end.entity.Favorite;
import com.example.back_end.service.favourite.FavoriteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/favorites")
public class FavoriteController {
    private final FavoriteService favoriteService;
    @PostMapping("/add")
    public ApiResponse<Course> addFavorite(@RequestBody FavoriteRequest request) {
        return favoriteService.addFavorite(request.getUserId(), request.getProductId());
    }
    @DeleteMapping("/remove")
    public ApiResponse<Void> deleteFavorite(@RequestBody FavoriteRequest request) {
        return favoriteService.removeFavorite(request.getUserId(), request.getProductId());
    }
    @GetMapping("/idUser/{userId}")
    public ApiResponse<List<Course>> getFavoritesByUserId(@PathVariable int userId) {
        return ApiResponse.<List<Course>>builder().result(favoriteService.getFavoritesByUserId(userId)).build();
    }

}
