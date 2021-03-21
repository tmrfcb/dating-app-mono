import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './user-app.reducer';
import { IUserApp } from 'app/shared/model/user-app.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUserAppDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserAppDetail = (props: IUserAppDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { userAppEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="datingApp.userApp.detail.title">UserApp</Translate> [<b>{userAppEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="firstName">
              <Translate contentKey="datingApp.userApp.firstName">First Name</Translate>
            </span>
          </dt>
          <dd>{userAppEntity.firstName}</dd>
          <dt>
            <span id="lastName">
              <Translate contentKey="datingApp.userApp.lastName">Last Name</Translate>
            </span>
          </dt>
          <dd>{userAppEntity.lastName}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="datingApp.userApp.email">Email</Translate>
            </span>
          </dt>
          <dd>{userAppEntity.email}</dd>
          <dt>
            <span id="phoneNumber">
              <Translate contentKey="datingApp.userApp.phoneNumber">Phone Number</Translate>
            </span>
          </dt>
          <dd>{userAppEntity.phoneNumber}</dd>
          <dt>
            <span id="birthDate">
              <Translate contentKey="datingApp.userApp.birthDate">Birth Date</Translate>
            </span>
          </dt>
          <dd>
            {userAppEntity.birthDate ? <TextFormat value={userAppEntity.birthDate} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="datingApp.userApp.facebook">Facebook</Translate>
          </dt>
          <dd>{userAppEntity.facebook ? userAppEntity.facebook.id : ''}</dd>
          <dt>
            <Translate contentKey="datingApp.userApp.location">Location</Translate>
          </dt>
          <dd>{userAppEntity.location ? userAppEntity.location.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/user-app" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/user-app/${userAppEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ userApp }: IRootState) => ({
  userAppEntity: userApp.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserAppDetail);
