package com.smartagri.backend.service.admin;

import com.smartagri.backend.dto.admin.CropRequest;
import com.smartagri.backend.entity.Crop;
import com.smartagri.backend.exception.BusinessException;
import com.smartagri.backend.repository.CropRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminCropService {

    private final CropRepository cropRepository;

    public Page<Crop> getAllCrops(Pageable pageable) {
        return cropRepository.findAll(pageable);
    }

    public Page<Crop> searchCrops(String searchTerm, Pageable pageable) {
        return cropRepository.findByNameContainingIgnoreCase(searchTerm, pageable);
    }

    public Crop getCropById(Long id) {
        return cropRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Crop not found with id: " + id));
    }

    @Transactional
    public Crop createCrop(CropRequest request) {
        if (cropRepository.existsByName(request.getName())) {
            throw new BusinessException("Crop already exists with name: " + request.getName());
        }

        Crop crop = Crop.builder()
                .name(request.getName())
                .season(request.getSeason())
                .duration(request.getDuration())
                .waterRequirement(request.getWaterRequirement())
                .tempRange(request.getTempRange())
                .soilType(request.getSoilType())
                .yield(request.getYield())
                .description(request.getDescription())
                .image(request.getImage())
                .growingTips(request.getGrowingTips())
                .commonDiseases(request.getCommonDiseases())
                .fertilizerRecommendation(request.getFertilizerRecommendation())
                .isActive(true)
                .build();

        crop = cropRepository.save(crop);
        log.info("Crop created: {}", crop.getName());
        return crop;
    }

    @Transactional
    public Crop updateCrop(Long id, CropRequest request) {
        Crop crop = getCropById(id);

        // Check if name is being changed and if it's already taken
        if (!crop.getName().equals(request.getName()) && 
            cropRepository.existsByName(request.getName())) {
            throw new BusinessException("Crop already exists with name: " + request.getName());
        }

        crop.setName(request.getName());
        crop.setSeason(request.getSeason());
        crop.setDuration(request.getDuration());
        crop.setWaterRequirement(request.getWaterRequirement());
        crop.setTempRange(request.getTempRange());
        crop.setSoilType(request.getSoilType());
        
        if (request.getYield() != null) {
            crop.setYield(request.getYield());
        }
        
        if (request.getDescription() != null) {
            crop.setDescription(request.getDescription());
        }
        
        if (request.getImage() != null) {
            crop.setImage(request.getImage());
        }
        
        if (request.getGrowingTips() != null) {
            crop.setGrowingTips(request.getGrowingTips());
        }
        
        if (request.getCommonDiseases() != null) {
            crop.setCommonDiseases(request.getCommonDiseases());
        }
        
        if (request.getFertilizerRecommendation() != null) {
            crop.setFertilizerRecommendation(request.getFertilizerRecommendation());
        }

        crop = cropRepository.save(crop);
        log.info("Crop updated: {}", crop.getName());
        return crop;
    }

    @Transactional
    public void deleteCrop(Long id) {
        Crop crop = getCropById(id);
        
        // Soft delete - just deactivate
        crop.setIsActive(false);
        cropRepository.save(crop);
        
        // For hard delete:
        // cropRepository.delete(crop);
        
        log.info("Crop deactivated: {}", crop.getName());
    }

    @Transactional
    public void activateCrop(Long id) {
        Crop crop = getCropById(id);
        crop.setIsActive(true);
        cropRepository.save(crop);
        log.info("Crop activated: {}", crop.getName());
    }

    public List<Crop> getAllActiveCrops() {
        return cropRepository.findAllActive();
    }

    public long getCropCount() {
        return cropRepository.count();
    }
}