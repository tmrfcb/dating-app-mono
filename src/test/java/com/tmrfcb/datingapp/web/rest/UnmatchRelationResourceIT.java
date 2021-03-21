package com.tmrfcb.datingapp.web.rest;

import com.tmrfcb.datingapp.RedisTestContainerExtension;
import com.tmrfcb.datingapp.DatingApp;
import com.tmrfcb.datingapp.domain.UnmatchRelation;
import com.tmrfcb.datingapp.repository.UnmatchRelationRepository;
import com.tmrfcb.datingapp.repository.search.UnmatchRelationSearchRepository;
import com.tmrfcb.datingapp.service.UnmatchRelationService;

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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

import static com.tmrfcb.datingapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link UnmatchRelationResource} REST controller.
 */
@SpringBootTest(classes = DatingApp.class)
@ExtendWith({ RedisTestContainerExtension.class, MockitoExtension.class })
@AutoConfigureMockMvc
@WithMockUser
public class UnmatchRelationResourceIT {

    private static final ZonedDateTime DEFAULT_UN_MATCH_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UN_MATCH_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private UnmatchRelationRepository unmatchRelationRepository;

    @Autowired
    private UnmatchRelationService unmatchRelationService;

    /**
     * This repository is mocked in the com.tmrfcb.datingapp.repository.search test package.
     *
     * @see com.tmrfcb.datingapp.repository.search.UnmatchRelationSearchRepositoryMockConfiguration
     */
    @Autowired
    private UnmatchRelationSearchRepository mockUnmatchRelationSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUnmatchRelationMockMvc;

    private UnmatchRelation unmatchRelation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UnmatchRelation createEntity(EntityManager em) {
        UnmatchRelation unmatchRelation = new UnmatchRelation()
            .unMatchDate(DEFAULT_UN_MATCH_DATE);
        return unmatchRelation;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UnmatchRelation createUpdatedEntity(EntityManager em) {
        UnmatchRelation unmatchRelation = new UnmatchRelation()
            .unMatchDate(UPDATED_UN_MATCH_DATE);
        return unmatchRelation;
    }

    @BeforeEach
    public void initTest() {
        unmatchRelation = createEntity(em);
    }

    @Test
    @Transactional
    public void createUnmatchRelation() throws Exception {
        int databaseSizeBeforeCreate = unmatchRelationRepository.findAll().size();
        // Create the UnmatchRelation
        restUnmatchRelationMockMvc.perform(post("/api/unmatch-relations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(unmatchRelation)))
            .andExpect(status().isCreated());

        // Validate the UnmatchRelation in the database
        List<UnmatchRelation> unmatchRelationList = unmatchRelationRepository.findAll();
        assertThat(unmatchRelationList).hasSize(databaseSizeBeforeCreate + 1);
        UnmatchRelation testUnmatchRelation = unmatchRelationList.get(unmatchRelationList.size() - 1);
        assertThat(testUnmatchRelation.getUnMatchDate()).isEqualTo(DEFAULT_UN_MATCH_DATE);

        // Validate the UnmatchRelation in Elasticsearch
        verify(mockUnmatchRelationSearchRepository, times(1)).save(testUnmatchRelation);
    }

    @Test
    @Transactional
    public void createUnmatchRelationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = unmatchRelationRepository.findAll().size();

        // Create the UnmatchRelation with an existing ID
        unmatchRelation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUnmatchRelationMockMvc.perform(post("/api/unmatch-relations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(unmatchRelation)))
            .andExpect(status().isBadRequest());

        // Validate the UnmatchRelation in the database
        List<UnmatchRelation> unmatchRelationList = unmatchRelationRepository.findAll();
        assertThat(unmatchRelationList).hasSize(databaseSizeBeforeCreate);

        // Validate the UnmatchRelation in Elasticsearch
        verify(mockUnmatchRelationSearchRepository, times(0)).save(unmatchRelation);
    }


    @Test
    @Transactional
    public void getAllUnmatchRelations() throws Exception {
        // Initialize the database
        unmatchRelationRepository.saveAndFlush(unmatchRelation);

        // Get all the unmatchRelationList
        restUnmatchRelationMockMvc.perform(get("/api/unmatch-relations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(unmatchRelation.getId().intValue())))
            .andExpect(jsonPath("$.[*].unMatchDate").value(hasItem(sameInstant(DEFAULT_UN_MATCH_DATE))));
    }
    
    @Test
    @Transactional
    public void getUnmatchRelation() throws Exception {
        // Initialize the database
        unmatchRelationRepository.saveAndFlush(unmatchRelation);

        // Get the unmatchRelation
        restUnmatchRelationMockMvc.perform(get("/api/unmatch-relations/{id}", unmatchRelation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(unmatchRelation.getId().intValue()))
            .andExpect(jsonPath("$.unMatchDate").value(sameInstant(DEFAULT_UN_MATCH_DATE)));
    }
    @Test
    @Transactional
    public void getNonExistingUnmatchRelation() throws Exception {
        // Get the unmatchRelation
        restUnmatchRelationMockMvc.perform(get("/api/unmatch-relations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUnmatchRelation() throws Exception {
        // Initialize the database
        unmatchRelationService.save(unmatchRelation);

        int databaseSizeBeforeUpdate = unmatchRelationRepository.findAll().size();

        // Update the unmatchRelation
        UnmatchRelation updatedUnmatchRelation = unmatchRelationRepository.findById(unmatchRelation.getId()).get();
        // Disconnect from session so that the updates on updatedUnmatchRelation are not directly saved in db
        em.detach(updatedUnmatchRelation);
        updatedUnmatchRelation
            .unMatchDate(UPDATED_UN_MATCH_DATE);

        restUnmatchRelationMockMvc.perform(put("/api/unmatch-relations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedUnmatchRelation)))
            .andExpect(status().isOk());

        // Validate the UnmatchRelation in the database
        List<UnmatchRelation> unmatchRelationList = unmatchRelationRepository.findAll();
        assertThat(unmatchRelationList).hasSize(databaseSizeBeforeUpdate);
        UnmatchRelation testUnmatchRelation = unmatchRelationList.get(unmatchRelationList.size() - 1);
        assertThat(testUnmatchRelation.getUnMatchDate()).isEqualTo(UPDATED_UN_MATCH_DATE);

        // Validate the UnmatchRelation in Elasticsearch
        verify(mockUnmatchRelationSearchRepository, times(2)).save(testUnmatchRelation);
    }

    @Test
    @Transactional
    public void updateNonExistingUnmatchRelation() throws Exception {
        int databaseSizeBeforeUpdate = unmatchRelationRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUnmatchRelationMockMvc.perform(put("/api/unmatch-relations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(unmatchRelation)))
            .andExpect(status().isBadRequest());

        // Validate the UnmatchRelation in the database
        List<UnmatchRelation> unmatchRelationList = unmatchRelationRepository.findAll();
        assertThat(unmatchRelationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the UnmatchRelation in Elasticsearch
        verify(mockUnmatchRelationSearchRepository, times(0)).save(unmatchRelation);
    }

    @Test
    @Transactional
    public void deleteUnmatchRelation() throws Exception {
        // Initialize the database
        unmatchRelationService.save(unmatchRelation);

        int databaseSizeBeforeDelete = unmatchRelationRepository.findAll().size();

        // Delete the unmatchRelation
        restUnmatchRelationMockMvc.perform(delete("/api/unmatch-relations/{id}", unmatchRelation.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UnmatchRelation> unmatchRelationList = unmatchRelationRepository.findAll();
        assertThat(unmatchRelationList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the UnmatchRelation in Elasticsearch
        verify(mockUnmatchRelationSearchRepository, times(1)).deleteById(unmatchRelation.getId());
    }

    @Test
    @Transactional
    public void searchUnmatchRelation() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        unmatchRelationService.save(unmatchRelation);
        when(mockUnmatchRelationSearchRepository.search(queryStringQuery("id:" + unmatchRelation.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(unmatchRelation), PageRequest.of(0, 1), 1));

        // Search the unmatchRelation
        restUnmatchRelationMockMvc.perform(get("/api/_search/unmatch-relations?query=id:" + unmatchRelation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(unmatchRelation.getId().intValue())))
            .andExpect(jsonPath("$.[*].unMatchDate").value(hasItem(sameInstant(DEFAULT_UN_MATCH_DATE))));
    }
}
