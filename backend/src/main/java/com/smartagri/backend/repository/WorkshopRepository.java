package com.smartagri.backend.repository;

import com.smartagri.backend.entity.Workshop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {

    Page<Workshop> findByStatus(String status, Pageable pageable);

    Page<Workshop> findByType(String type, Pageable pageable);

    @Query("SELECT w FROM Workshop w WHERE w.dateTime >= :now AND w.status = 'UPCOMING' ORDER BY w.dateTime ASC")
    List<Workshop> findUpcomingWorkshops(@Param("now") LocalDateTime now);

    @Query("SELECT w FROM Workshop w WHERE w.dateTime < :now AND w.status = 'UPCOMING'")
    List<Workshop> findExpiredUpcomingWorkshops(@Param("now") LocalDateTime now);

    @Query("SELECT w FROM Workshop w WHERE w.isFeatured = true AND w.status = 'UPCOMING'")
    List<Workshop> findFeaturedWorkshops();

    // Add to WorkshopRepository
    long countByStatus(String status);
}