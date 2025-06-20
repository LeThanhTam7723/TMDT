package com.example.back_end.controller;

import com.example.back_end.dto.request.ReportRequestDTO;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.ReportResponseDTO;
import com.example.back_end.entity.Report;
import com.example.back_end.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/create")
    public ApiResponse<ReportResponseDTO> createReport(@RequestBody ReportRequestDTO dto) {
        ReportResponseDTO response = reportService.createReport(dto);
        return ApiResponse.<ReportResponseDTO>builder()
                .code(0)
                .message("Report submitted successfully")
                .result(response)
                .build();
    }
    @GetMapping("/all")
    public ApiResponse<List<ReportResponseDTO>> getAllReports() {
        List<ReportResponseDTO> response = reportService.getAllReports();
        return ApiResponse.<List<ReportResponseDTO>>builder()
                .code(0)
                .message("Lấy danh sách báo cáo thành công")
                .result(response)
                .build();
    }
}
