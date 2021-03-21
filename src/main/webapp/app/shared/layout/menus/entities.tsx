import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <MenuItem icon="asterisk" to="/facebook">
      <Translate contentKey="global.menu.entities.facebook" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/user-app">
      <Translate contentKey="global.menu.entities.userApp" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/relation">
      <Translate contentKey="global.menu.entities.relation" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/match-relation">
      <Translate contentKey="global.menu.entities.matchRelation" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/unmatch-relation">
      <Translate contentKey="global.menu.entities.unmatchRelation" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/message">
      <Translate contentKey="global.menu.entities.message" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/report-user">
      <Translate contentKey="global.menu.entities.reportUser" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/location">
      <Translate contentKey="global.menu.entities.location" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/country">
      <Translate contentKey="global.menu.entities.country" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
