package com.campus.service;

import com.campus.dto.ResourceRequest;
import com.campus.dto.ResourceResponse;
import com.campus.entity.Resource;
import com.campus.exception.ResourceNotFoundException;
import com.campus.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public ResourceResponse createResource(ResourceRequest request) {
        Resource resource = new Resource();
        resource.setName(request.getName());
        resource.setType(Resource.ResourceType.valueOf(request.getType()));
        resource.setCapacity(request.getCapacity());
        resource.setStatus(Resource.ResourceStatus.valueOf(request.getStatus()));

        return new ResourceResponse(resourceRepository.save(resource));
    }

    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(ResourceResponse::new)
                .collect(Collectors.toList());
    }

    public ResourceResponse getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return new ResourceResponse(resource);
    }

    public ResourceResponse updateResource(Long id, ResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resource.setName(request.getName());
        resource.setType(Resource.ResourceType.valueOf(request.getType()));
        resource.setCapacity(request.getCapacity());
        resource.setStatus(Resource.ResourceStatus.valueOf(request.getStatus()));

        return new ResourceResponse(resourceRepository.save(resource));
    }

    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }

    public long count() {
        return resourceRepository.count();
    }
}
