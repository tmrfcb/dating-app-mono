package com.tmrfcb.datingapp.service;

import com.tmrfcb.datingapp.domain.Facebook;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Facebook}.
 */
public interface FacebookService {

    /**
     * Save a facebook.
     *
     * @param facebook the entity to save.
     * @return the persisted entity.
     */
    Facebook save(Facebook facebook);

    /**
     * Get all the facebooks.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Facebook> findAll(Pageable pageable);
    /**
     * Get all the FacebookDTO where UserApp is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<Facebook> findAllWhereUserAppIsNull();


    /**
     * Get the "id" facebook.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Facebook> findOne(Long id);

    /**
     * Delete the "id" facebook.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the facebook corresponding to the query.
     *
     * @param query the query of the search.
     * 
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Facebook> search(String query, Pageable pageable);
}
