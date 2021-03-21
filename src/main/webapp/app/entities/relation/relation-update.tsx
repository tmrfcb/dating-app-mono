import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IMatchRelation } from 'app/shared/model/match-relation.model';
import { getEntities as getMatchRelations } from 'app/entities/match-relation/match-relation.reducer';
import { IUnmatchRelation } from 'app/shared/model/unmatch-relation.model';
import { getEntities as getUnmatchRelations } from 'app/entities/unmatch-relation/unmatch-relation.reducer';
import { IUserApp } from 'app/shared/model/user-app.model';
import { getEntities as getUserApps } from 'app/entities/user-app/user-app.reducer';
import { getEntity, updateEntity, createEntity, reset } from './relation.reducer';
import { IRelation } from 'app/shared/model/relation.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IRelationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RelationUpdate = (props: IRelationUpdateProps) => {
  const [matchRelationId, setMatchRelationId] = useState('0');
  const [unmatchRelationId, setUnmatchRelationId] = useState('0');
  const [userAppId, setUserAppId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { relationEntity, matchRelations, unmatchRelations, userApps, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/relation' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getMatchRelations();
    props.getUnmatchRelations();
    props.getUserApps();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...relationEntity,
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
          <h2 id="datingApp.relation.home.createOrEditLabel">
            <Translate contentKey="datingApp.relation.home.createOrEditLabel">Create or edit a Relation</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : relationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="relation-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="relation-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="userIdOfOtherLabel" for="relation-userIdOfOther">
                  <Translate contentKey="datingApp.relation.userIdOfOther">User Id Of Other</Translate>
                </Label>
                <AvField id="relation-userIdOfOther" type="text" name="userIdOfOther" />
              </AvGroup>
              <AvGroup>
                <Label id="relationTypeLabel" for="relation-relationType">
                  <Translate contentKey="datingApp.relation.relationType">Relation Type</Translate>
                </Label>
                <AvInput
                  id="relation-relationType"
                  type="select"
                  className="form-control"
                  name="relationType"
                  value={(!isNew && relationEntity.relationType) || 'LIKE'}
                >
                  <option value="LIKE">{translate('datingApp.RelationType.LIKE')}</option>
                  <option value="DISLIKE">{translate('datingApp.RelationType.DISLIKE')}</option>
                  <option value="SUPERLIKE">{translate('datingApp.RelationType.SUPERLIKE')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="relation-matchRelation">
                  <Translate contentKey="datingApp.relation.matchRelation">Match Relation</Translate>
                </Label>
                <AvInput id="relation-matchRelation" type="select" className="form-control" name="matchRelation.id">
                  <option value="" key="0" />
                  {matchRelations
                    ? matchRelations.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="relation-unmatchRelation">
                  <Translate contentKey="datingApp.relation.unmatchRelation">Unmatch Relation</Translate>
                </Label>
                <AvInput id="relation-unmatchRelation" type="select" className="form-control" name="unmatchRelation.id">
                  <option value="" key="0" />
                  {unmatchRelations
                    ? unmatchRelations.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="relation-userApp">
                  <Translate contentKey="datingApp.relation.userApp">User App</Translate>
                </Label>
                <AvInput id="relation-userApp" type="select" className="form-control" name="userApp.id">
                  <option value="" key="0" />
                  {userApps
                    ? userApps.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/relation" replace color="info">
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
  matchRelations: storeState.matchRelation.entities,
  unmatchRelations: storeState.unmatchRelation.entities,
  userApps: storeState.userApp.entities,
  relationEntity: storeState.relation.entity,
  loading: storeState.relation.loading,
  updating: storeState.relation.updating,
  updateSuccess: storeState.relation.updateSuccess,
});

const mapDispatchToProps = {
  getMatchRelations,
  getUnmatchRelations,
  getUserApps,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RelationUpdate);
