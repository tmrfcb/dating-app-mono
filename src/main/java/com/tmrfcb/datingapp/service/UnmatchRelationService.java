package com.tmrfcb.datingapp.service;

import com.tmrfcb.datingapp.domain.UnmatchRelation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link UnmatchRelation}.
 */
public interface UnmatchRelationService {

    /**
     * Save a unmatchRelation.
     *
     * @param unmatchRelation the entity to save.
     * @return the persisted entity.
     */
    UnmatchRelation save(UnmatchRelation unmatchRelation);

    /**
     * Get all the unmatchRelations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UnmatchRelation> findAll(Pageable pageable);
    /**
     * Get all the UnmatchRelationDTO where Relation is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<UnmatchRelation> findAllWhereRelationIsNull();


    /**
     * Get the "id" unmatchRelation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UnmatchRelation> findOne(Long id);

    /**
     * Delete the "id" unmatchRelation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the unmatchRelation corresponding to the query.
     *
     * @param query the query of the search.
     * 
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UnmatchRelation> search(String query, Pageable pageable);
}
