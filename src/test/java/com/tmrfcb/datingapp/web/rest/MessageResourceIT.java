package com.tmrfcb.datingapp.web.rest;

import com.tmrfcb.datingapp.RedisTestContainerExtension;
import com.tmrfcb.datingapp.DatingApp;
import com.tmrfcb.datingapp.domain.Message;
import com.tmrfcb.datingapp.repository.MessageRepository;
import com.tmrfcb.datingapp.repository.search.MessageSearchRepository;
import com.tmrfcb.datingapp.service.MessageService;

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
import org.springframework.util.Base64Utils;
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
 * Integration tests for the {@link MessageResource} REST controller.
 */
@SpringBootTest(classes = DatingApp.class)
@ExtendWith({ RedisTestContainerExtension.class, MockitoExtension.class })
@AutoConfigureMockMvc
@WithMockUser
public class MessageResourceIT {

    private static final String DEFAULT_SENDER_ID = "AAAAAAAAAA";
    private static final String UPDATED_SENDER_ID = "BBBBBBBBBB";

    private static final String DEFAULT_RECEIVER_ID = "AAAAAAAAAA";
    private static final String UPDATED_RECEIVER_ID = "BBBBBBBBBB";

    private static final String DEFAULT_MESSAGE_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE_CONTENT = "BBBBBBBBBB";

    private static final String DEFAULT_MESSAGE_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE_TITLE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_MESSAGE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MESSAGE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageService messageService;

    /**
     * This repository is mocked in the com.tmrfcb.datingapp.repository.search test package.
     *
     * @see com.tmrfcb.datingapp.repository.search.MessageSearchRepositoryMockConfiguration
     */
    @Autowired
    private MessageSearchRepository mockMessageSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMessageMockMvc;

    private Message message;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Message createEntity(EntityManager em) {
        Message message = new Message()
            .senderId(DEFAULT_SENDER_ID)
            .receiverId(DEFAULT_RECEIVER_ID)
            .messageContent(DEFAULT_MESSAGE_CONTENT)
            .messageTitle(DEFAULT_MESSAGE_TITLE)
            .messageDate(DEFAULT_MESSAGE_DATE);
        return message;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Message createUpdatedEntity(EntityManager em) {
        Message message = new Message()
            .senderId(UPDATED_SENDER_ID)
            .receiverId(UPDATED_RECEIVER_ID)
            .messageContent(UPDATED_MESSAGE_CONTENT)
            .messageTitle(UPDATED_MESSAGE_TITLE)
            .messageDate(UPDATED_MESSAGE_DATE);
        return message;
    }

    @BeforeEach
    public void initTest() {
        message = createEntity(em);
    }

    @Test
    @Transactional
    public void createMessage() throws Exception {
        int databaseSizeBeforeCreate = messageRepository.findAll().size();
        // Create the Message
        restMessageMockMvc.perform(post("/api/messages")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(message)))
            .andExpect(status().isCreated());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeCreate + 1);
        Message testMessage = messageList.get(messageList.size() - 1);
        assertThat(testMessage.getSenderId()).isEqualTo(DEFAULT_SENDER_ID);
        assertThat(testMessage.getReceiverId()).isEqualTo(DEFAULT_RECEIVER_ID);
        assertThat(testMessage.getMessageContent()).isEqualTo(DEFAULT_MESSAGE_CONTENT);
        assertThat(testMessage.getMessageTitle()).isEqualTo(DEFAULT_MESSAGE_TITLE);
        assertThat(testMessage.getMessageDate()).isEqualTo(DEFAULT_MESSAGE_DATE);

        // Validate the Message in Elasticsearch
        verify(mockMessageSearchRepository, times(1)).save(testMessage);
    }

    @Test
    @Transactional
    public void createMessageWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = messageRepository.findAll().size();

        // Create the Message with an existing ID
        message.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMessageMockMvc.perform(post("/api/messages")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(message)))
            .andExpect(status().isBadRequest());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeCreate);

        // Validate the Message in Elasticsearch
        verify(mockMessageSearchRepository, times(0)).save(message);
    }


    @Test
    @Transactional
    public void getAllMessages() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList
        restMessageMockMvc.perform(get("/api/messages?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(message.getId().intValue())))
            .andExpect(jsonPath("$.[*].senderId").value(hasItem(DEFAULT_SENDER_ID)))
            .andExpect(jsonPath("$.[*].receiverId").value(hasItem(DEFAULT_RECEIVER_ID)))
            .andExpect(jsonPath("$.[*].messageContent").value(hasItem(DEFAULT_MESSAGE_CONTENT)))
            .andExpect(jsonPath("$.[*].messageTitle").value(hasItem(DEFAULT_MESSAGE_TITLE.toString())))
            .andExpect(jsonPath("$.[*].messageDate").value(hasItem(sameInstant(DEFAULT_MESSAGE_DATE))));
    }
    
    @Test
    @Transactional
    public void getMessage() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get the message
        restMessageMockMvc.perform(get("/api/messages/{id}", message.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(message.getId().intValue()))
            .andExpect(jsonPath("$.senderId").value(DEFAULT_SENDER_ID))
            .andExpect(jsonPath("$.receiverId").value(DEFAULT_RECEIVER_ID))
            .andExpect(jsonPath("$.messageContent").value(DEFAULT_MESSAGE_CONTENT))
            .andExpect(jsonPath("$.messageTitle").value(DEFAULT_MESSAGE_TITLE.toString()))
            .andExpect(jsonPath("$.messageDate").value(sameInstant(DEFAULT_MESSAGE_DATE)));
    }
    @Test
    @Transactional
    public void getNonExistingMessage() throws Exception {
        // Get the message
        restMessageMockMvc.perform(get("/api/messages/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMessage() throws Exception {
        // Initialize the database
        messageService.save(message);

        int databaseSizeBeforeUpdate = messageRepository.findAll().size();

        // Update the message
        Message updatedMessage = messageRepository.findById(message.getId()).get();
        // Disconnect from session so that the updates on updatedMessage are not directly saved in db
        em.detach(updatedMessage);
        updatedMessage
            .senderId(UPDATED_SENDER_ID)
            .receiverId(UPDATED_RECEIVER_ID)
            .messageContent(UPDATED_MESSAGE_CONTENT)
            .messageTitle(UPDATED_MESSAGE_TITLE)
            .messageDate(UPDATED_MESSAGE_DATE);

        restMessageMockMvc.perform(put("/api/messages")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedMessage)))
            .andExpect(status().isOk());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeUpdate);
        Message testMessage = messageList.get(messageList.size() - 1);
        assertThat(testMessage.getSenderId()).isEqualTo(UPDATED_SENDER_ID);
        assertThat(testMessage.getReceiverId()).isEqualTo(UPDATED_RECEIVER_ID);
        assertThat(testMessage.getMessageContent()).isEqualTo(UPDATED_MESSAGE_CONTENT);
        assertThat(testMessage.getMessageTitle()).isEqualTo(UPDATED_MESSAGE_TITLE);
        assertThat(testMessage.getMessageDate()).isEqualTo(UPDATED_MESSAGE_DATE);

        // Validate the Message in Elasticsearch
        verify(mockMessageSearchRepository, times(2)).save(testMessage);
    }

    @Test
    @Transactional
    public void updateNonExistingMessage() throws Exception {
        int databaseSizeBeforeUpdate = messageRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMessageMockMvc.perform(put("/api/messages")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(message)))
            .andExpect(status().isBadRequest());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Message in Elasticsearch
        verify(mockMessageSearchRepository, times(0)).save(message);
    }

    @Test
    @Transactional
    public void deleteMessage() throws Exception {
        // Initialize the database
        messageService.save(message);

        int databaseSizeBeforeDelete = messageRepository.findAll().size();

        // Delete the message
        restMessageMockMvc.perform(delete("/api/messages/{id}", message.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Message in Elasticsearch
        verify(mockMessageSearchRepository, times(1)).deleteById(message.getId());
    }

    @Test
    @Transactional
    public void searchMessage() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        messageService.save(message);
        when(mockMessageSearchRepository.search(queryStringQuery("id:" + message.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(message), PageRequest.of(0, 1), 1));

        // Search the message
        restMessageMockMvc.perform(get("/api/_search/messages?query=id:" + message.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(message.getId().intValue())))
            .andExpect(jsonPath("$.[*].senderId").value(hasItem(DEFAULT_SENDER_ID)))
            .andExpect(jsonPath("$.[*].receiverId").value(hasItem(DEFAULT_RECEIVER_ID)))
            .andExpect(jsonPath("$.[*].messageContent").value(hasItem(DEFAULT_MESSAGE_CONTENT)))
            .andExpect(jsonPath("$.[*].messageTitle").value(hasItem(DEFAULT_MESSAGE_TITLE.toString())))
            .andExpect(jsonPath("$.[*].messageDate").value(hasItem(sameInstant(DEFAULT_MESSAGE_DATE))));
    }
}
