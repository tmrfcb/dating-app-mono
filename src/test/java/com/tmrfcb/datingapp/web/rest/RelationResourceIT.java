package com.tmrfcb.datingapp.web.rest;

import com.tmrfcb.datingapp.RedisTestContainerExtension;
import com.tmrfcb.datingapp.DatingApp;
import com.tmrfcb.datingapp.domain.Relation;
import com.tmrfcb.datingapp.repository.RelationRepository;
import com.tmrfcb.datingapp.repository.search.RelationSearchRepository;
import com.tmrfcb.datingapp.service.RelationService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tmrfcb.datingapp.domain.enumeration.RelationType;
/**
 * Integration tests for the {@link RelationResource} REST controller.
 */
@SpringBootTest(classes = DatingApp.class)
@ExtendWith({ RedisTestContainerExtension.class, MockitoExtension.class })
@AutoConfigureMockMvc
@WithMockUser
public class RelationResourceIT {

    private static final String DEFAULT_USER_ID_OF_OTHER = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID_OF_OTHER = "BBBBBBBBBB";

    private static final RelationType DEFAULT_RELATION_TYPE = RelationType.LIKE;
    private static final RelationType UPDATED_RELATION_TYPE = RelationType.DISLIKE;

    @Autowired
    private RelationRepository relationRepository;

    @Autowired
    private RelationService relationService;

    /**
     * This repository is mocked in the com.tmrfcb.datingapp.repository.search test package.
     *
     * @see com.tmrfcb.datingapp.repository.search.RelationSearchRepositoryMockConfiguration
     */
    @Autowired
    private RelationSearchRepository mockRelationSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRelationMockMvc;

    private Relation relation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Relation createEntity(EntityManager em) {
        Relation relation = new Relation()
            .userIdOfOther(DEFAULT_USER_ID_OF_OTHER)
            .relationType(DEFAULT_RELATION_TYPE);
        return relation;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Relation createUpdatedEntity(EntityManager em) {
        Relation relation = new Relation()
            .userIdOfOther(UPDATED_USER_ID_OF_OTHER)
            .relationType(UPDATED_RELATION_TYPE);
        return relation;
    }

    @BeforeEach
    public void initTest() {
        relation = createEntity(em);
    }

    @Test
    @Transactional
    public void createRelation() throws Exception {
        int databaseSizeBeforeCreate = relationRepository.findAll().size();
        // Create the Relation
        restRelationMockMvc.perform(post("/api/relations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(relation)))
            .andExpect(status().isCreated());

        // Validate the Relation in the database
        List<Relation> relationList = relationRepository.findAll();
        assertThat(relationList).hasSize(databaseSizeBeforeCreate + 1);
        Relation testRelation = relationList.get(relationList.size() - 1);
        assertThat(testRelation.getUserIdOfOther()).isEqualTo(DEFAULT_USER_ID_OF_OTHER);
        assertThat(testRelation.getRelationType()).isEqualTo(DEFAULT_RELATION_TYPE);

        // Validate the Relation in Elasticsearch
        verify(mockRelationSearchRepository, times(1)).save(testRelation);
    }

    @Test
    @Transactional
    public void createRelationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = relationRepository.findAll().size();

        // Create the Relation with an existing ID
        relation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRelationMockMvc.perform(post("/api/relations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(relation)))
            .andExpect(status().isBadRequest());

        // Validate the Relation in the database
        List<Relation> relationList = relationRepository.findAll();
        assertThat(relationList).hasSize(databaseSizeBeforeCreate);

        // Validate the Relation in Elasticsearch
        verify(mockRelationSearchRepository, times(0)).save(relation);
    }


    @Test
    @Transactional
    public void getAllRelations() throws Exception {
        // Initialize the database
        relationRepository.saveAndFlush(relation);

        // Get all the relationList
        restRelationMockMvc.perform(get("/api/relations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(relation.getId().intValue())))
            .andExpect(jsonPath("$.[*].userIdOfOther").value(hasItem(DEFAULT_USER_ID_OF_OTHER)))
            .andExpect(jsonPath("$.[*].relationType").value(hasItem(DEFAULT_RELATION_TYPE.toString())));
    }
    
    @Test
    @Transactional
    public void getRelation() throws Exception {
        // Initialize the database
        relationRepository.saveAndFlush(relation);

        // Get the relation
        restRelationMockMvc.perform(get("/api/relations/{id}", relation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(relation.getId().intValue()))
            .andExpect(jsonPath("$.userIdOfOther").value(DEFAULT_USER_ID_OF_OTHER))
            .andExpect(jsonPath("$.relationType").value(DEFAULT_RELATION_TYPE.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingRelation() throws Exception {
        // Get the relation
        restRelationMockMvc.perform(get("/api/relations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRelation() throws Exception {
        // Initialize the database
        relationService.save(relation);

        int databaseSizeBeforeUpdate = relationRepository.findAll().size();

        // Update the relation
        Relation updatedRelation = relationRepository.findById(relation.getId()).get();
        // Disconnect from session so that the updates on updatedRelation are not directly saved in db
        em.detach(updatedRelation);
        updatedRelation
            .userIdOfOther(UPDATED_USER_ID_OF_OTHER)
            .relationType(UPDATED_RELATION_TYPE);

        restRelationMockMvc.perform(put("/api/relations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedRelation)))
            .andExpect(status().isOk());

        // Validate the Relation in the database
        List<Relation> relationList = relationRepository.findAll();
        assertThat(relationList).hasSize(databaseSizeBeforeUpdate);
        Relation testRelation = relationList.get(relationList.size() - 1);
        assertThat(testRelation.getUserIdOfOther()).isEqualTo(UPDATED_USER_ID_OF_OTHER);
        assertThat(testRelation.getRelationType()).isEqualTo(UPDATED_RELATION_TYPE);

        // Validate the Relation in Elasticsearch
        verify(mockRelationSearchRepository, times(2)).save(testRelation);
    }

    @Test
    @Transactional
    public void updateNonExistingRelation() throws Exception {
        int databaseSizeBeforeUpdate = relationRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRelationMockMvc.perform(put("/api/relations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(relation)))
            .andExpect(status().isBadRequest());

        // Validate the Relation in the database
        List<Relation> relationList = relationRepository.findAll();
        assertThat(relationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Relation in Elasticsearch
        verify(mockRelationSearchRepository, times(0)).save(relation);
    }

    @Test
    @Transactional
    public void deleteRelation() throws Exception {
        // Initialize the database
        relationService.save(relation);

        int databaseSizeBeforeDelete = relationRepository.findAll().size();

        // Delete the relation
        restRelationMockMvc.perform(delete("/api/relations/{id}", relation.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Relation> relationList = relationRepository.findAll();
        assertThat(relationList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Relation in Elasticsearch
        verify(mockRelationSearchRepository, times(1)).deleteById(relation.getId());
    }

    @Test
    @Transactional
    public void searchRelation() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        relationService.save(relation);
        when(mockRelationSearchRepository.search(queryStringQuery("id:" + relation.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(relation), PageRequest.of(0, 1), 1));

        // Search the relation
        restRelationMockMvc.perform(get("/api/_search/relations?query=id:" + relation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(relation.getId().intValue())))
            .andExpect(jsonPath("$.[*].userIdOfOther").value(hasItem(DEFAULT_USER_ID_OF_OTHER)))
            .andExpect(jsonPath("$.[*].relationType").value(hasItem(DEFAULT_RELATION_TYPE.toString())));
    }
}
