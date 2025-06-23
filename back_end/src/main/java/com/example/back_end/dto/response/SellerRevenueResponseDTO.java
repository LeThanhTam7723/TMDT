package com.example.back_end.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerRevenueResponseDTO {
    private Double totalRevenue;
    private Double monthlyRevenue;
    private List<MonthlyRevenueData> monthlyData;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyRevenueData {
        private String month;
        private Double revenue;
        private Integer orders;
    }
} 