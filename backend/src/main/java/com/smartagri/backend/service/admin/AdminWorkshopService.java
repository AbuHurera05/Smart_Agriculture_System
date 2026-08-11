package com.smartagri.backend.service.admin;

import com.smartagri.backend.dto.admin.WorkshopRequest;
import com.smartagri.backend.entity.Workshop;
import com.smartagri.backend.exception.BusinessException;
import com.smartagri.backend.repository.WorkshopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminWorkshopService {

    private final WorkshopRepository workshopRepository;

    public Page<Workshop> getAllWorkshops(Pageable pageable) {
        return workshopRepository.findAll(pageable);
    }

    public Page<Workshop> getWorkshopsByStatus(String status, Pageable pageable) {
        return workshopRepository.findByStatus(status, pageable);
    }

    public Page<Workshop> getWorkshopsByType(String type, Pageable pageable) {
        return workshopRepository.findByType(type, pageable);
    }

    public Workshop getWorkshopById(Long id) {
        return workshopRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Workshop not found with id: " + id));
    }

    @Transactional
    public Workshop createWorkshop(WorkshopRequest request) {
        Workshop workshop = Workshop.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .instructor(request.getInstructor())
                .dateTime(request.getDateTime())
                .venue(request.getVenue())
                .type(request.getType())
                .capacity(request.getCapacity())
                .enrolledCount(0)
                .price(request.getPrice())
                .topics(request.getTopics())
                .prerequisites(request.getPrerequisites())
                .status(request.getStatus() != null ? request.getStatus() : "UPCOMING")
                .isFeatured(false)
                .build();

        workshop = workshopRepository.save(workshop);
        log.info("Workshop created: {}", workshop.getTitle());
        return workshop;
    }

    @Transactional
    public Workshop updateWorkshop(Long id, WorkshopRequest request) {
        Workshop workshop = getWorkshopById(id);

        workshop.setTitle(request.getTitle());
        workshop.setDescription(request.getDescription());
        workshop.setInstructor(request.getInstructor());
        workshop.setDateTime(request.getDateTime());
        workshop.setVenue(request.getVenue());
        workshop.setType(request.getType());
        workshop.setCapacity(request.getCapacity());
        workshop.setPrice(request.getPrice());
        workshop.setTopics(request.getTopics());
        workshop.setPrerequisites(request.getPrerequisites());
        workshop.setStatus(request.getStatus());

        workshop = workshopRepository.save(workshop);
        log.info("Workshop updated: {}", workshop.getTitle());
        return workshop;
    }

    @Transactional
    public void deleteWorkshop(Long id) {
        Workshop workshop = getWorkshopById(id);
        workshopRepository.delete(workshop);
        log.info("Workshop deleted: {}", workshop.getTitle());
    }

    @Transactional
    public Workshop toggleFeatured(Long id) {
        Workshop workshop = getWorkshopById(id);
        workshop.setIsFeatured(!workshop.getIsFeatured());
        workshop = workshopRepository.save(workshop);
        log.info("Workshop featured toggled: {} - {}", workshop.getTitle(), workshop.getIsFeatured());
        return workshop;
    }

    @Transactional
    public Workshop updateStatus(Long id, String status) {
        Workshop workshop = getWorkshopById(id);
        workshop.setStatus(status);
        workshop = workshopRepository.save(workshop);
        log.info("Workshop status updated: {} - {}", workshop.getTitle(), status);
        return workshop;
    }

    public List<Workshop> getUpcomingWorkshops() {
        return workshopRepository.findUpcomingWorkshops(LocalDateTime.now());
    }

    public List<Workshop> getFeaturedWorkshops() {
        return workshopRepository.findFeaturedWorkshops();
    }

    @Transactional
    public void updateWorkshopStatuses() {
        LocalDateTime now = LocalDateTime.now();
        
        // Find workshops that should be marked as COMPLETED
        List<Workshop> completedWorkshops = workshopRepository.findAll().stream()
                .filter(w -> w.getStatus().equals("UPCOMING") && w.getDateTime().isBefore(now))
                .toList();
        
        for (Workshop workshop : completedWorkshops) {
            workshop.setStatus("COMPLETED");
            workshopRepository.save(workshop);
            log.info("Workshop marked as COMPLETED: {}", workshop.getTitle());
        }
    }

    public long getWorkshopCount() {
        return workshopRepository.count();
    }

    public long getWorkshopCountByStatus(String status) {
        return workshopRepository.countByStatus(status);
    }

    public int getTotalEnrolled() {
        return workshopRepository.findAll().stream()
                .mapToInt(Workshop::getEnrolledCount)
                .sum();
    }
}