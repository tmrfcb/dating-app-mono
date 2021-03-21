import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './unmatch-relation.reducer';
import { IUnmatchRelation } from 'app/shared/model/unmatch-relation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUnmatchRelationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UnmatchRelationDetail = (props: IUnmatchRelationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { unmatchRelationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="datingApp.unmatchRelation.detail.title">UnmatchRelation</Translate> [<b>{unmatchRelationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="unMatchDate">
              <Translate contentKey="datingApp.unmatchRelation.unMatchDate">Un Match Date</Translate>
            </span>
          </dt>
          <dd>
            {unmatchRelationEntity.unMatchDate ? (
              <TextFormat value={unmatchRelationEntity.unMatchDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/unmatch-relation" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/unmatch-relation/${unmatchRelationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ unmatchRelation }: IRootState) => ({
  unmatchRelationEntity: unmatchRelation.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UnmatchRelationDetail);
