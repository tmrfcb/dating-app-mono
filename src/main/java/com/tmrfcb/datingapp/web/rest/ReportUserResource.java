package com.tmrfcb.datingapp.web.rest;

import com.tmrfcb.datingapp.domain.ReportUser;
import com.tmrfcb.datingapp.service.ReportUserService;
import com.tmrfcb.datingapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.tmrfcb.datingapp.domain.ReportUser}.
 */
@RestController
@RequestMapping("/api")
public class ReportUserResource {

    private final Logger log = LoggerFactory.getLogger(ReportUserResource.class);

    private static final String ENTITY_NAME = "reportUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReportUserService reportUserService;

    public ReportUserResource(ReportUserService reportUserService) {
        this.reportUserService = reportUserService;
    }

    /**
     * {@code POST  /report-users} : Create a new reportUser.
     *
     * @param reportUser the reportUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reportUser, or with status {@code 400 (Bad Request)} if the reportUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/report-users")
    public ResponseEntity<ReportUser> createReportUser(@RequestBody ReportUser reportUser) throws URISyntaxException {
        log.debug("REST request to save ReportUser : {}", reportUser);
        if (reportUser.getId() != null) {
            throw new BadRequestAlertException("A new reportUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ReportUser result = reportUserService.save(reportUser);
        return ResponseEntity.created(new URI("/api/report-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /report-users} : Updates an existing reportUser.
     *
     * @param reportUser the reportUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reportUser,
     * or with status {@code 400 (Bad Request)} if the reportUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reportUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/report-users")
    public ResponseEntity<ReportUser> updateReportUser(@RequestBody ReportUser reportUser) throws URISyntaxException {
        log.debug("REST request to update ReportUser : {}", reportUser);
        if (reportUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ReportUser result = reportUserService.save(reportUser);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reportUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /report-users} : get all the reportUsers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reportUsers in body.
     */
    @GetMapping("/report-users")
    public ResponseEntity<List<ReportUser>> getAllReportUsers(Pageable pageable) {
        log.debug("REST request to get a page of ReportUsers");
        Page<ReportUser> page = reportUserService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /report-users/:id} : get the "id" reportUser.
     *
     * @param id the id of the reportUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reportUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/report-users/{id}")
    public ResponseEntity<ReportUser> getReportUser(@PathVariable Long id) {
        log.debug("REST request to get ReportUser : {}", id);
        Optional<ReportUser> reportUser = reportUserService.findOne(id);
        return ResponseUtil.wrapOrNotFound(reportUser);
    }

    /**
     * {@code DELETE  /report-users/:id} : delete the "id" reportUser.
     *
     * @param id the id of the reportUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/report-users/{id}")
    public ResponseEntity<Void> deleteReportUser(@PathVariable Long id) {
        log.debug("REST request to delete ReportUser : {}", id);
        reportUserService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/report-users?query=:query} : search for the reportUser corresponding
     * to the query.
     *
     * @param query the query of the reportUser search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/report-users")
    public ResponseEntity<List<ReportUser>> searchReportUsers(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ReportUsers for query {}", query);
        Page<ReportUser> page = reportUserService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
        }
}
