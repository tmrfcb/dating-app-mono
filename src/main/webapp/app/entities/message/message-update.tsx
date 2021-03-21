import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IMatchRelation } from 'app/shared/model/match-relation.model';
import { getEntities as getMatchRelations } from 'app/entities/match-relation/match-relation.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './message.reducer';
import { IMessage } from 'app/shared/model/message.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IMessageUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const MessageUpdate = (props: IMessageUpdateProps) => {
  const [matchRelationId, setMatchRelationId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { messageEntity, matchRelations, loading, updating } = props;

  const { messageTitle } = messageEntity;

  const handleClose = () => {
    props.history.push('/message' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getMatchRelations();
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
    values.messageDate = convertDateTimeToServer(values.messageDate);

    if (errors.length === 0) {
      const entity = {
        ...messageEntity,
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
          <h2 id="datingApp.message.home.createOrEditLabel">
            <Translate contentKey="datingApp.message.home.createOrEditLabel">Create or edit a Message</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : messageEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="message-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="message-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="senderIdLabel" for="message-senderId">
                  <Translate contentKey="datingApp.message.senderId">Sender Id</Translate>
                </Label>
                <AvField id="message-senderId" type="text" name="senderId" />
              </AvGroup>
              <AvGroup>
                <Label id="receiverIdLabel" for="message-receiverId">
                  <Translate contentKey="datingApp.message.receiverId">Receiver Id</Translate>
                </Label>
                <AvField id="message-receiverId" type="text" name="receiverId" />
              </AvGroup>
              <AvGroup>
                <Label id="messageContentLabel" for="message-messageContent">
                  <Translate contentKey="datingApp.message.messageContent">Message Content</Translate>
                </Label>
                <AvField id="message-messageContent" type="text" name="messageContent" />
              </AvGroup>
              <AvGroup>
                <Label id="messageTitleLabel" for="message-messageTitle">
                  <Translate contentKey="datingApp.message.messageTitle">Message Title</Translate>
                </Label>
                <AvInput id="message-messageTitle" type="textarea" name="messageTitle" />
              </AvGroup>
              <AvGroup>
                <Label id="messageDateLabel" for="message-messageDate">
                  <Translate contentKey="datingApp.message.messageDate">Message Date</Translate>
                </Label>
                <AvInput
                  id="message-messageDate"
                  type="datetime-local"
                  className="form-control"
                  name="messageDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.messageEntity.messageDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="message-matchRelation">
                  <Translate contentKey="datingApp.message.matchRelation">Match Relation</Translate>
                </Label>
                <AvInput id="message-matchRelation" type="select" className="form-control" name="matchRelation.id">
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
              <Button tag={Link} id="cancel-save" to="/message" replace color="info">
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
  messageEntity: storeState.message.entity,
  loading: storeState.message.loading,
  updating: storeState.message.updating,
  updateSuccess: storeState.message.updateSuccess,
});

const mapDispatchToProps = {
  getMatchRelations,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MessageUpdate);
