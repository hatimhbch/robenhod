package com.example.demo.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ArticleRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 555, message = "Title must be less than 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 900, message = "Description must be less than 500 characters")
    private String description;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Slug is required")
    @Size(max = 655, message = "Slug must be less than 255 characters")
    private String slug;

    private String imageUrl;

    // Explicit getters and setters (in case Lombok is not working)
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}