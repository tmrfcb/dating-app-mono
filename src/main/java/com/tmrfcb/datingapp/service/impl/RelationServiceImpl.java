package com.tmrfcb.datingapp.service.impl;

import com.tmrfcb.datingapp.service.RelationService;
import com.tmrfcb.datingapp.domain.Relation;
import com.tmrfcb.datingapp.repository.RelationRepository;
import com.tmrfcb.datingapp.repository.search.RelationSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Relation}.
 */
@Service
@Transactional
public class RelationServiceImpl implements RelationService {

    private final Logger log = LoggerFactory.getLogger(RelationServiceImpl.class);

    private final RelationRepository relationRepository;

    private final RelationSearchRepository relationSearchRepository;

    public RelationServiceImpl(RelationRepository relationRepository, RelationSearchRepository relationSearchRepository) {
        this.relationRepository = relationRepository;
        this.relationSearchRepository = relationSearchRepository;
    }

    @Override
    public Relation save(Relation relation) {
        log.debug("Request to save Relation : {}", relation);
        Relation result = relationRepository.save(relation);
        relationSearchRepository.save(result);
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Relation> findAll(Pageable pageable) {
        log.debug("Request to get all Relations");
        return relationRepository.findAll(pageable);
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<Relation> findOne(Long id) {
        log.debug("Request to get Relation : {}", id);
        return relationRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Relation : {}", id);
        relationRepository.deleteById(id);
        relationSearchRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Relation> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Relations for query {}", query);
        return relationSearchRepository.search(queryStringQuery(query), pageable);    }
}
