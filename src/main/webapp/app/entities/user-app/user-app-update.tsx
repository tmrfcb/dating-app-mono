import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IFacebook } from 'app/shared/model/facebook.model';
import { getEntities as getFacebooks } from 'app/entities/facebook/facebook.reducer';
import { ILocation } from 'app/shared/model/location.model';
import { getEntities as getLocations } from 'app/entities/location/location.reducer';
import { getEntity, updateEntity, createEntity, reset } from './user-app.reducer';
import { IUserApp } from 'app/shared/model/user-app.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IUserAppUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserAppUpdate = (props: IUserAppUpdateProps) => {
  const [facebookId, setFacebookId] = useState('0');
  const [locationId, setLocationId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { userAppEntity, facebooks, locations, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/user-app');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }

    props.getFacebooks();
    props.getLocations();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...userAppEntity,
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
          <h2 id="datingApp.userApp.home.createOrEditLabel">
            <Translate contentKey="datingApp.userApp.home.createOrEditLabel">Create or edit a UserApp</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : userAppEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="user-app-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="user-app-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="firstNameLabel" for="user-app-firstName">
                  <Translate contentKey="datingApp.userApp.firstName">First Name</Translate>
                </Label>
                <AvField id="user-app-firstName" type="text" name="firstName" />
              </AvGroup>
              <AvGroup>
                <Label id="lastNameLabel" for="user-app-lastName">
                  <Translate contentKey="datingApp.userApp.lastName">Last Name</Translate>
                </Label>
                <AvField id="user-app-lastName" type="text" name="lastName" />
              </AvGroup>
              <AvGroup>
                <Label id="emailLabel" for="user-app-email">
                  <Translate contentKey="datingApp.userApp.email">Email</Translate>
                </Label>
                <AvField id="user-app-email" type="text" name="email" />
              </AvGroup>
              <AvGroup>
                <Label id="phoneNumberLabel" for="user-app-phoneNumber">
                  <Translate contentKey="datingApp.userApp.phoneNumber">Phone Number</Translate>
                </Label>
                <AvField id="user-app-phoneNumber" type="text" name="phoneNumber" />
              </AvGroup>
              <AvGroup>
                <Label id="birthDateLabel" for="user-app-birthDate">
                  <Translate contentKey="datingApp.userApp.birthDate">Birth Date</Translate>
                </Label>
                <AvField id="user-app-birthDate" type="date" className="form-control" name="birthDate" />
              </AvGroup>
              <AvGroup>
                <Label for="user-app-facebook">
                  <Translate contentKey="datingApp.userApp.facebook">Facebook</Translate>
                </Label>
                <AvInput id="user-app-facebook" type="select" className="form-control" name="facebook.id">
                  <option value="" key="0" />
                  {facebooks
                    ? facebooks.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="user-app-location">
                  <Translate contentKey="datingApp.userApp.location">Location</Translate>
                </Label>
                <AvInput id="user-app-location" type="select" className="form-control" name="location.id">
                  <option value="" key="0" />
                  {locations
                    ? locations.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/user-app" replace color="info">
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
  facebooks: storeState.facebook.entities,
  locations: storeState.location.entities,
  userAppEntity: storeState.userApp.entity,
  loading: storeState.userApp.loading,
  updating: storeState.userApp.updating,
  updateSuccess: storeState.userApp.updateSuccess,
});

const mapDispatchToProps = {
  getFacebooks,
  getLocations,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserAppUpdate);
