import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './relation.reducer';
import { IRelation } from 'app/shared/model/relation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRelationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RelationDetail = (props: IRelationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { relationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="datingApp.relation.detail.title">Relation</Translate> [<b>{relationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userIdOfOther">
              <Translate contentKey="datingApp.relation.userIdOfOther">User Id Of Other</Translate>
            </span>
          </dt>
          <dd>{relationEntity.userIdOfOther}</dd>
          <dt>
            <span id="relationType">
              <Translate contentKey="datingApp.relation.relationType">Relation Type</Translate>
            </span>
          </dt>
          <dd>{relationEntity.relationType}</dd>
          <dt>
            <Translate contentKey="datingApp.relation.matchRelation">Match Relation</Translate>
          </dt>
          <dd>{relationEntity.matchRelation ? relationEntity.matchRelation.id : ''}</dd>
          <dt>
            <Translate contentKey="datingApp.relation.unmatchRelation">Unmatch Relation</Translate>
          </dt>
          <dd>{relationEntity.unmatchRelation ? relationEntity.unmatchRelation.id : ''}</dd>
          <dt>
            <Translate contentKey="datingApp.relation.userApp">User App</Translate>
          </dt>
          <dd>{relationEntity.userApp ? relationEntity.userApp.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/relation" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/relation/${relationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ relation }: IRootState) => ({
  relationEntity: relation.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RelationDetail);
