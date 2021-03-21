package com.tmrfcb.datingapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.tmrfcb.datingapp.web.rest.TestUtil;

public class RelationTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Relation.class);
        Relation relation1 = new Relation();
        relation1.setId(1L);
        Relation relation2 = new Relation();
        relation2.setId(relation1.getId());
        assertThat(relation1).isEqualTo(relation2);
        relation2.setId(2L);
        assertThat(relation1).isNotEqualTo(relation2);
        relation1.setId(null);
        assertThat(relation1).isNotEqualTo(relation2);
    }
}
