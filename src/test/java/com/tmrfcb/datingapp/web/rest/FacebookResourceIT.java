package com.tmrfcb.datingapp.web.rest;

import com.tmrfcb.datingapp.RedisTestContainerExtension;
import com.tmrfcb.datingapp.DatingApp;
import com.tmrfcb.datingapp.domain.Facebook;
import com.tmrfcb.datingapp.repository.FacebookRepository;
import com.tmrfcb.datingapp.repository.search.FacebookSearchRepository;
import com.tmrfcb.datingapp.service.FacebookService;

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

/**
 * Integration tests for the {@link FacebookResource} REST controller.
 */
@SpringBootTest(classes = DatingApp.class)
@ExtendWith({ RedisTestContainerExtension.class, MockitoExtension.class })
@AutoConfigureMockMvc
@WithMockUser
public class FacebookResourceIT {

    @Autowired
    private FacebookRepository facebookRepository;

    @Autowired
    private FacebookService facebookService;

    /**
     * This repository is mocked in the com.tmrfcb.datingapp.repository.search test package.
     *
     * @see com.tmrfcb.datingapp.repository.search.FacebookSearchRepositoryMockConfiguration
     */
    @Autowired
    private FacebookSearchRepository mockFacebookSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFacebookMockMvc;

    private Facebook facebook;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Facebook createEntity(EntityManager em) {
        Facebook facebook = new Facebook();
        return facebook;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Facebook createUpdatedEntity(EntityManager em) {
        Facebook facebook = new Facebook();
        return facebook;
    }

    @BeforeEach
    public void initTest() {
        facebook = createEntity(em);
    }

    @Test
    @Transactional
    public void createFacebook() throws Exception {
        int databaseSizeBeforeCreate = facebookRepository.findAll().size();
        // Create the Facebook
        restFacebookMockMvc.perform(post("/api/facebooks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(facebook)))
            .andExpect(status().isCreated());

        // Validate the Facebook in the database
        List<Facebook> facebookList = facebookRepository.findAll();
        assertThat(facebookList).hasSize(databaseSizeBeforeCreate + 1);
        Facebook testFacebook = facebookList.get(facebookList.size() - 1);

        // Validate the Facebook in Elasticsearch
        verify(mockFacebookSearchRepository, times(1)).save(testFacebook);
    }

    @Test
    @Transactional
    public void createFacebookWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = facebookRepository.findAll().size();

        // Create the Facebook with an existing ID
        facebook.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFacebookMockMvc.perform(post("/api/facebooks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(facebook)))
            .andExpect(status().isBadRequest());

        // Validate the Facebook in the database
        List<Facebook> facebookList = facebookRepository.findAll();
        assertThat(facebookList).hasSize(databaseSizeBeforeCreate);

        // Validate the Facebook in Elasticsearch
        verify(mockFacebookSearchRepository, times(0)).save(facebook);
    }


    @Test
    @Transactional
    public void getAllFacebooks() throws Exception {
        // Initialize the database
        facebookRepository.saveAndFlush(facebook);

        // Get all the facebookList
        restFacebookMockMvc.perform(get("/api/facebooks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(facebook.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getFacebook() throws Exception {
        // Initialize the database
        facebookRepository.saveAndFlush(facebook);

        // Get the facebook
        restFacebookMockMvc.perform(get("/api/facebooks/{id}", facebook.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(facebook.getId().intValue()));
    }
    @Test
    @Transactional
    public void getNonExistingFacebook() throws Exception {
        // Get the facebook
        restFacebookMockMvc.perform(get("/api/facebooks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFacebook() throws Exception {
        // Initialize the database
        facebookService.save(facebook);

        int databaseSizeBeforeUpdate = facebookRepository.findAll().size();

        // Update the facebook
        Facebook updatedFacebook = facebookRepository.findById(facebook.getId()).get();
        // Disconnect from session so that the updates on updatedFacebook are not directly saved in db
        em.detach(updatedFacebook);

        restFacebookMockMvc.perform(put("/api/facebooks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedFacebook)))
            .andExpect(status().isOk());

        // Validate the Facebook in the database
        List<Facebook> facebookList = facebookRepository.findAll();
        assertThat(facebookList).hasSize(databaseSizeBeforeUpdate);
        Facebook testFacebook = facebookList.get(facebookList.size() - 1);

        // Validate the Facebook in Elasticsearch
        verify(mockFacebookSearchRepository, times(2)).save(testFacebook);
    }

    @Test
    @Transactional
    public void updateNonExistingFacebook() throws Exception {
        int databaseSizeBeforeUpdate = facebookRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFacebookMockMvc.perform(put("/api/facebooks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(facebook)))
            .andExpect(status().isBadRequest());

        // Validate the Facebook in the database
        List<Facebook> facebookList = facebookRepository.findAll();
        assertThat(facebookList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Facebook in Elasticsearch
        verify(mockFacebookSearchRepository, times(0)).save(facebook);
    }

    @Test
    @Transactional
    public void deleteFacebook() throws Exception {
        // Initialize the database
        facebookService.save(facebook);

        int databaseSizeBeforeDelete = facebookRepository.findAll().size();

        // Delete the facebook
        restFacebookMockMvc.perform(delete("/api/facebooks/{id}", facebook.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Facebook> facebookList = facebookRepository.findAll();
        assertThat(facebookList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Facebook in Elasticsearch
        verify(mockFacebookSearchRepository, times(1)).deleteById(facebook.getId());
    }

    @Test
    @Transactional
    public void searchFacebook() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        facebookService.save(facebook);
        when(mockFacebookSearchRepository.search(queryStringQuery("id:" + facebook.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(facebook), PageRequest.of(0, 1), 1));

        // Search the facebook
        restFacebookMockMvc.perform(get("/api/_search/facebooks?query=id:" + facebook.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(facebook.getId().intValue())));
    }
}
