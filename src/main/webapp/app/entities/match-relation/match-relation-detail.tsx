import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './match-relation.reducer';
import { IMatchRelation } from 'app/shared/model/match-relation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IMatchRelationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const MatchRelationDetail = (props: IMatchRelationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { matchRelationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="datingApp.matchRelation.detail.title">MatchRelation</Translate> [<b>{matchRelationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="matchDate">
              <Translate contentKey="datingApp.matchRelation.matchDate">Match Date</Translate>
            </span>
          </dt>
          <dd>
            {matchRelationEntity.matchDate ? (
              <TextFormat value={matchRelationEntity.matchDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/match-relation" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/match-relation/${matchRelationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ matchRelation }: IRootState) => ({
  matchRelationEntity: matchRelation.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MatchRelationDetail);
