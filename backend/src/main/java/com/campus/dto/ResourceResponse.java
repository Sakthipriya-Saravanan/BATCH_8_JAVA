package com.campus.dto;

import com.campus.entity.Resource;

public class ResourceResponse {
    private Long id;
    private String name;
    private String type;
    private Integer capacity;
    private String status;

    public ResourceResponse() {}

    public ResourceResponse(Resource resource) {
        this.id = resource.getId();
        this.name = resource.getName();
        this.type = resource.getType().name();
        this.capacity = resource.getCapacity();
        this.status = resource.getStatus().name();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
