package com.zelixa.zelixa.service;

import com.zelixa.zelixa.entity.Category;
import com.zelixa.zelixa.repository.CategoryRepository;
import com.zelixa.zelixa.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Page<Category> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category createCategory(Category category) {
        if (category.getSlug() == null || category.getSlug().trim().isEmpty()) {
            String slug = SlugUtils.makeSlug(category.getName());
            if (categoryRepository.existsBySlug(slug)) {
                slug = slug + "-" + java.util.UUID.randomUUID().toString().substring(0, 5);
            }
            category.setSlug(slug);
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category category) {
        category.setId(id);
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
