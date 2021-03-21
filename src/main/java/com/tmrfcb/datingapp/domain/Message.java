package com.tmrfcb.datingapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Message.
 */
@Entity
@Table(name = "message")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "message")
public class Message implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_id")
    private String senderId;

    @Column(name = "receiver_id")
    private String receiverId;

    @Column(name = "message_content")
    private String messageContent;

    @Lob
    @Column(name = "message_title")
    private String messageTitle;

    @Column(name = "message_date")
    private ZonedDateTime messageDate;

    @ManyToOne
    @JsonIgnoreProperties(value = "messages", allowSetters = true)
    private MatchRelation matchRelation;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSenderId() {
        return senderId;
    }

    public Message senderId(String senderId) {
        this.senderId = senderId;
        return this;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public Message receiverId(String receiverId) {
        this.receiverId = receiverId;
        return this;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public Message messageContent(String messageContent) {
        this.messageContent = messageContent;
        return this;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public String getMessageTitle() {
        return messageTitle;
    }

    public Message messageTitle(String messageTitle) {
        this.messageTitle = messageTitle;
        return this;
    }

    public void setMessageTitle(String messageTitle) {
        this.messageTitle = messageTitle;
    }

    public ZonedDateTime getMessageDate() {
        return messageDate;
    }

    public Message messageDate(ZonedDateTime messageDate) {
        this.messageDate = messageDate;
        return this;
    }

    public void setMessageDate(ZonedDateTime messageDate) {
        this.messageDate = messageDate;
    }

    public MatchRelation getMatchRelation() {
        return matchRelation;
    }

    public Message matchRelation(MatchRelation matchRelation) {
        this.matchRelation = matchRelation;
        return this;
    }

    public void setMatchRelation(MatchRelation matchRelation) {
        this.matchRelation = matchRelation;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Message)) {
            return false;
        }
        return id != null && id.equals(((Message) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Message{" +
            "id=" + getId() +
            ", senderId='" + getSenderId() + "'" +
            ", receiverId='" + getReceiverId() + "'" +
            ", messageContent='" + getMessageContent() + "'" +
            ", messageTitle='" + getMessageTitle() + "'" +
            ", messageDate='" + getMessageDate() + "'" +
            "}";
    }
}
