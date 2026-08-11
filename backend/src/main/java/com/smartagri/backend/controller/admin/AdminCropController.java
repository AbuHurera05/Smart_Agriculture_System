package com.smartagri.backend.controller.admin;

import com.smartagri.backend.dto.admin.CropRequest;
import com.smartagri.backend.entity.Crop;
import com.smartagri.backend.service.admin.AdminCropService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/crops")
@PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
@RequiredArgsConstructor
@Slf4j
public class AdminCropController {

    private final AdminCropService adminCropService;

    @GetMapping
    public ResponseEntity<Page<Crop>> getAllCrops(
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(adminCropService.getAllCrops(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Crop>> searchCrops(
            @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminCropService.searchCrops(query, pageable));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Crop>> getAllActiveCrops() {
        return ResponseEntity.ok(adminCropService.getAllActiveCrops());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Crop> getCropById(@PathVariable Long id) {
        return ResponseEntity.ok(adminCropService.getCropById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Crop> createCrop(@Valid @RequestBody CropRequest request) {
        Crop crop = adminCropService.createCrop(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(crop);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Crop> updateCrop(
            @PathVariable Long id,
            @Valid @RequestBody CropRequest request) {
        return ResponseEntity.ok(adminCropService.updateCrop(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCrop(@PathVariable Long id) {
        adminCropService.deleteCrop(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> activateCrop(@PathVariable Long id) {
        adminCropService.activateCrop(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Object> getCropStats() {
        return ResponseEntity.ok(new Object() {
            public final long total = adminCropService.getCropCount();
        });
    }
}