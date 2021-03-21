import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './report-user.reducer';
import { IReportUser } from 'app/shared/model/report-user.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IReportUserUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReportUserUpdate = (props: IReportUserUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { reportUserEntity, loading, updating } = props;

  const { cause } = reportUserEntity;

  const handleClose = () => {
    props.history.push('/report-user' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...reportUserEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="datingApp.reportUser.home.createOrEditLabel">
            <Translate contentKey="datingApp.reportUser.home.createOrEditLabel">Create or edit a ReportUser</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : reportUserEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="report-user-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="report-user-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="reportIdLabel" for="report-user-reportId">
                  <Translate contentKey="datingApp.reportUser.reportId">Report Id</Translate>
                </Label>
                <AvField id="report-user-reportId" type="text" name="reportId" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="report-user-userId">
                  <Translate contentKey="datingApp.reportUser.userId">User Id</Translate>
                </Label>
                <AvField id="report-user-userId" type="text" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="causeLabel" for="report-user-cause">
                  <Translate contentKey="datingApp.reportUser.cause">Cause</Translate>
                </Label>
                <AvInput id="report-user-cause" type="textarea" name="cause" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/report-user" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  reportUserEntity: storeState.reportUser.entity,
  loading: storeState.reportUser.loading,
  updating: storeState.reportUser.updating,
  updateSuccess: storeState.reportUser.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReportUserUpdate);
