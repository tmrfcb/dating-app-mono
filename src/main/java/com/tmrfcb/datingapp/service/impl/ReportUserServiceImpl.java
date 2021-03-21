package com.tmrfcb.datingapp.service.impl;

import com.tmrfcb.datingapp.service.ReportUserService;
import com.tmrfcb.datingapp.domain.ReportUser;
import com.tmrfcb.datingapp.repository.ReportUserRepository;
import com.tmrfcb.datingapp.repository.search.ReportUserSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link ReportUser}.
 */
@Service
@Transactional
public class ReportUserServiceImpl implements ReportUserService {

    private final Logger log = LoggerFactory.getLogger(ReportUserServiceImpl.class);

    private final ReportUserRepository reportUserRepository;

    private final ReportUserSearchRepository reportUserSearchRepository;

    public ReportUserServiceImpl(ReportUserRepository reportUserRepository, ReportUserSearchRepository reportUserSearchRepository) {
        this.reportUserRepository = reportUserRepository;
        this.reportUserSearchRepository = reportUserSearchRepository;
    }

    @Override
    public ReportUser save(ReportUser reportUser) {
        log.debug("Request to save ReportUser : {}", reportUser);
        ReportUser result = reportUserRepository.save(reportUser);
        reportUserSearchRepository.save(result);
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportUser> findAll(Pageable pageable) {
        log.debug("Request to get all ReportUsers");
        return reportUserRepository.findAll(pageable);
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<ReportUser> findOne(Long id) {
        log.debug("Request to get ReportUser : {}", id);
        return reportUserRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ReportUser : {}", id);
        reportUserRepository.deleteById(id);
        reportUserSearchRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportUser> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of ReportUsers for query {}", query);
        return reportUserSearchRepository.search(queryStringQuery(query), pageable);    }
}
