package com.tmrfcb.datingapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.tmrfcb.datingapp.web.rest.TestUtil;

public class ReportUserTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReportUser.class);
        ReportUser reportUser1 = new ReportUser();
        reportUser1.setId(1L);
        ReportUser reportUser2 = new ReportUser();
        reportUser2.setId(reportUser1.getId());
        assertThat(reportUser1).isEqualTo(reportUser2);
        reportUser2.setId(2L);
        assertThat(reportUser1).isNotEqualTo(reportUser2);
        reportUser1.setId(null);
        assertThat(reportUser1).isNotEqualTo(reportUser2);
    }
}
