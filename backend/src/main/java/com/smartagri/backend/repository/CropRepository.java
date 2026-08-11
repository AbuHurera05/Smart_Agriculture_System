package com.smartagri.backend.repository;

import com.smartagri.backend.entity.Crop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    
    Optional<Crop> findByName(String name);
    
    boolean existsByName(String name);
    
    Page<Crop> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    @Query("SELECT c FROM Crop c WHERE c.season = :season")
    List<Crop> findBySeason(@Param("season") String season);
    
    @Query("SELECT c FROM Crop c WHERE c.isActive = true")
    List<Crop> findAllActive();
}