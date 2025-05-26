package com.example.back_end.service.favourite;

import com.example.back_end.repositories.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;


}
