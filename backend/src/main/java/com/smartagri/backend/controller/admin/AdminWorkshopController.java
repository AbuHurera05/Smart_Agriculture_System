package com.smartagri.backend.controller.admin;

import com.smartagri.backend.dto.admin.WorkshopRequest;
import com.smartagri.backend.entity.Workshop;
import com.smartagri.backend.service.admin.AdminWorkshopService;
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
@RequestMapping("/api/admin/workshops")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AdminWorkshopController {

    private final AdminWorkshopService adminWorkshopService;

    @GetMapping
    public ResponseEntity<Page<Workshop>> getAllWorkshops(
            @PageableDefault(size = 20, sort = "dateTime", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(adminWorkshopService.getAllWorkshops(pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<Workshop>> getWorkshopsByStatus(
            @PathVariable String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminWorkshopService.getWorkshopsByStatus(status, pageable));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Page<Workshop>> getWorkshopsByType(
            @PathVariable String type,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminWorkshopService.getWorkshopsByType(type, pageable));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Workshop>> getUpcomingWorkshops() {
        return ResponseEntity.ok(adminWorkshopService.getUpcomingWorkshops());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Workshop>> getFeaturedWorkshops() {
        return ResponseEntity.ok(adminWorkshopService.getFeaturedWorkshops());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workshop> getWorkshopById(@PathVariable Long id) {
        return ResponseEntity.ok(adminWorkshopService.getWorkshopById(id));
    }

    @PostMapping
    public ResponseEntity<Workshop> createWorkshop(@Valid @RequestBody WorkshopRequest request) {
        Workshop workshop = adminWorkshopService.createWorkshop(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(workshop);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Workshop> updateWorkshop(
            @PathVariable Long id,
            @Valid @RequestBody WorkshopRequest request) {
        return ResponseEntity.ok(adminWorkshopService.updateWorkshop(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkshop(@PathVariable Long id) {
        adminWorkshopService.deleteWorkshop(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/featured")
    public ResponseEntity<Workshop> toggleFeatured(@PathVariable Long id) {
        return ResponseEntity.ok(adminWorkshopService.toggleFeatured(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Workshop> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(adminWorkshopService.updateStatus(id, status));
    }

    @PostMapping("/update-statuses")
    public ResponseEntity<Void> updateWorkshopStatuses() {
        adminWorkshopService.updateWorkshopStatuses();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Object> getWorkshopStats() {
        return ResponseEntity.ok(new Object() {
            public final long total = adminWorkshopService.getWorkshopCount();
            public final long upcoming = adminWorkshopService.getWorkshopCountByStatus("UPCOMING");
            public final long ongoing = adminWorkshopService.getWorkshopCountByStatus("ONGOING");
            public final long completed = adminWorkshopService.getWorkshopCountByStatus("COMPLETED");
            public final int enrolled = adminWorkshopService.getTotalEnrolled();
        });
    }
}