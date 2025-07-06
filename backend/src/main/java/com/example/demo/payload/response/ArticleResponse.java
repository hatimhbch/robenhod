package com.example.demo.payload.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ArticleResponse {
    private Long id;
    private String title;
    private String description;
    private String content;
    private String slug;
    private String imageUrl;
    private String authorUsername;
    private Long authorId;
    private LocalDateTime createdAt;
    private long likeCount;
    // IMPORTANT: This field MUST be boolean, not String!
    // If you get compilation errors, check that your ArticleResponse class
    // has this field defined as boolean, not String
    private boolean hashLiked;

    // Explicit getters and setters (in case Lombok is not working)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(long likeCount) {
        this.likeCount = likeCount;
    }

    public boolean isHashLiked() {
        return this.hashLiked = hashLiked;
    }

    public void setHashLiked(boolean hashLiked) {
        this.hashLiked = hashLiked;
    }
}