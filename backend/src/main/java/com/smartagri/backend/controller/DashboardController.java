package com.smartagri.backend.controller;

import com.smartagri.backend.service.admin.AdminCropService;
import com.smartagri.backend.service.admin.AdminNewsService;
import com.smartagri.backend.service.admin.AdminUserService;
import com.smartagri.backend.service.admin.AdminWorkshopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AdminUserService adminUserService;
    private final AdminCropService adminCropService;
    private final AdminNewsService adminNewsService;
    private final AdminWorkshopService adminWorkshopService;

    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> getDashboardSummary() {
        return ResponseEntity.ok(new Object() {
            public final Object users = new Object() {
                public final long total = adminUserService.getUserCount();
                public final long active = adminUserService.getActiveUserCount();
            };
            public final Object crops = new Object() {
                public final long total = adminCropService.getCropCount();
                public final long active = adminCropService.getAllActiveCrops().size();
            };
            public final Object news = new Object() {
                public final long total = adminNewsService.getNewsCount();
                public final long published = adminNewsService.getPublishedNewsCount();
            };
            public final Object workshops = new Object() {
                public final long total = adminWorkshopService.getWorkshopCount();
                public final long upcoming = adminWorkshopService.getWorkshopCountByStatus("UPCOMING");
                public final int enrolled = adminWorkshopService.getTotalEnrolled();
            };
        });
    }
}