import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IRelation } from 'app/shared/model/relation.model';
import { getEntities as getRelations } from 'app/entities/relation/relation.reducer';
import { getEntity, updateEntity, createEntity, reset } from './unmatch-relation.reducer';
import { IUnmatchRelation } from 'app/shared/model/unmatch-relation.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IUnmatchRelationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UnmatchRelationUpdate = (props: IUnmatchRelationUpdateProps) => {
  const [relationId, setRelationId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { unmatchRelationEntity, relations, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/unmatch-relation' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getRelations();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.unMatchDate = convertDateTimeToServer(values.unMatchDate);

    if (errors.length === 0) {
      const entity = {
        ...unmatchRelationEntity,
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
          <h2 id="datingApp.unmatchRelation.home.createOrEditLabel">
            <Translate contentKey="datingApp.unmatchRelation.home.createOrEditLabel">Create or edit a UnmatchRelation</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : unmatchRelationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="unmatch-relation-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="unmatch-relation-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="unMatchDateLabel" for="unmatch-relation-unMatchDate">
                  <Translate contentKey="datingApp.unmatchRelation.unMatchDate">Un Match Date</Translate>
                </Label>
                <AvInput
                  id="unmatch-relation-unMatchDate"
                  type="datetime-local"
                  className="form-control"
                  name="unMatchDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.unmatchRelationEntity.unMatchDate)}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/unmatch-relation" replace color="info">
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
  relations: storeState.relation.entities,
  unmatchRelationEntity: storeState.unmatchRelation.entity,
  loading: storeState.unmatchRelation.loading,
  updating: storeState.unmatchRelation.updating,
  updateSuccess: storeState.unmatchRelation.updateSuccess,
});

const mapDispatchToProps = {
  getRelations,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UnmatchRelationUpdate);
