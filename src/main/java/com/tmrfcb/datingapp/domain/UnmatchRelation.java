package com.tmrfcb.datingapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A UnmatchRelation.
 */
@Entity
@Table(name = "unmatch_relation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "unmatchrelation")
public class UnmatchRelation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "un_match_date")
    private ZonedDateTime unMatchDate;

    @OneToOne(mappedBy = "unmatchRelation")
    @JsonIgnore
    private Relation relation;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getUnMatchDate() {
        return unMatchDate;
    }

    public UnmatchRelation unMatchDate(ZonedDateTime unMatchDate) {
        this.unMatchDate = unMatchDate;
        return this;
    }

    public void setUnMatchDate(ZonedDateTime unMatchDate) {
        this.unMatchDate = unMatchDate;
    }

    public Relation getRelation() {
        return relation;
    }

    public UnmatchRelation relation(Relation relation) {
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
        if (!(o instanceof UnmatchRelation)) {
            return false;
        }
        return id != null && id.equals(((UnmatchRelation) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UnmatchRelation{" +
            "id=" + getId() +
            ", unMatchDate='" + getUnMatchDate() + "'" +
            "}";
    }
}
