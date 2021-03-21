package com.tmrfcb.datingapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * A MatchRelation.
 */
@Entity
@Table(name = "match_relation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "matchrelation")
public class MatchRelation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "match_date")
    private ZonedDateTime matchDate;

    @OneToMany(mappedBy = "matchRelation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Message> messages = new HashSet<>();

    @OneToOne(mappedBy = "matchRelation")
    @JsonIgnore
    private Relation relation;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getMatchDate() {
        return matchDate;
    }

    public MatchRelation matchDate(ZonedDateTime matchDate) {
        this.matchDate = matchDate;
        return this;
    }

    public void setMatchDate(ZonedDateTime matchDate) {
        this.matchDate = matchDate;
    }

    public Set<Message> getMessages() {
        return messages;
    }

    public MatchRelation messages(Set<Message> messages) {
        this.messages = messages;
        return this;
    }

    public MatchRelation addMessage(Message message) {
        this.messages.add(message);
        message.setMatchRelation(this);
        return this;
    }

    public MatchRelation removeMessage(Message message) {
        this.messages.remove(message);
        message.setMatchRelation(null);
        return this;
    }

    public void setMessages(Set<Message> messages) {
        this.messages = messages;
    }

    public Relation getRelation() {
        return relation;
    }

    public MatchRelation relation(Relation relation) {
        this.relation = relation;
        return this;
    }

    public void setRelation(Relation relation) {
        this.relation = relation;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MatchRelation)) {
            return false;
        }
        return id != null && id.equals(((MatchRelation) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MatchRelation{" +
            "id=" + getId() +
            ", matchDate='" + getMatchDate() + "'" +
            "}";
    }
}
