package com.example.back_end.mapper;

import com.example.back_end.dto.request.OrderRequest;
import com.example.back_end.dto.response.OrderResponse;
import com.example.back_end.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface OrderMapper {

//    @Mappings({
//            @Mapping(source = "idUser.id", target = "idUser"),
//            @Mapping(source = "idCourse", target = "idCourse"),
//            @Mapping(source = "dateOrder", target = "dateOrder")
//    })
    OrderResponse toResponse(Order order);
}
