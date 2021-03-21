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
import { getEntity, updateEntity, createEntity, reset } from './match-relation.reducer';
import { IMatchRelation } from 'app/shared/model/match-relation.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IMatchRelationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const MatchRelationUpdate = (props: IMatchRelationUpdateProps) => {
  const [relationId, setRelationId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { matchRelationEntity, relations, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/match-relation' + props.location.search);
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
    values.matchDate = convertDateTimeToServer(values.matchDate);

    if (errors.length === 0) {
      const entity = {
        ...matchRelationEntity,
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
          <h2 id="datingApp.matchRelation.home.createOrEditLabel">
            <Translate contentKey="datingApp.matchRelation.home.createOrEditLabel">Create or edit a MatchRelation</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : matchRelationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="match-relation-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="match-relation-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="matchDateLabel" for="match-relation-matchDate">
                  <Translate contentKey="datingApp.matchRelation.matchDate">Match Date</Translate>
                </Label>
                <AvInput
                  id="match-relation-matchDate"
                  type="datetime-local"
                  className="form-control"
                  name="matchDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.matchRelationEntity.matchDate)}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/match-relation" replace color="info">
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
  matchRelationEntity: storeState.matchRelation.entity,
  loading: storeState.matchRelation.loading,
  updating: storeState.matchRelation.updating,
  updateSuccess: storeState.matchRelation.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchRelationUpdate);
