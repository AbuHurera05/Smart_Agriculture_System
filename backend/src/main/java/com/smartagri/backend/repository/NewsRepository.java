package com.smartagri.backend.repository;

import com.smartagri.backend.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    Page<News> findByStatus(String status, Pageable pageable);

    Page<News> findByCategory(String category, Pageable pageable);

    @Query("SELECT n FROM News n WHERE n.status = 'PUBLISHED' AND n.publishedDate <= :now ORDER BY n.publishedDate DESC")
    Page<News> findPublishedNews(@Param("now") LocalDateTime now, Pageable pageable);

    @Query("SELECT n FROM News n WHERE n.category = :category AND n.status = 'PUBLISHED'")
    Page<News> findPublishedByCategory(@Param("category") String category, Pageable pageable);

    List<News> findTop5ByStatusOrderByPublishedDateDesc(String status);

    // Add to NewsRepository
    long countByStatus(String status);
}