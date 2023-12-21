import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import Dropdown from 'react-bootstrap/Dropdown';
function ContextualExample() {

  return (
    <div class="dropdown">
    <a class="me-3 dropdown-toggle hidden-arrow" href="#" id="navbarDropdownMenuLink"
    role="button" data-mdb-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-bell"></i>
        <span class="badge rounded-pill badge-notification bg-danger">1</span>
    </a>
    <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        <li>
            <a class="dropdown-item" href="#">Some news</a>
        </li>
        <li>
            <a class="dropdown-item" href="#">Another news</a>
        </li>
        <li>
            <a class="dropdown-item" href="#">Something else here</a>
        </li>
    </ul>
</div>
  );
}

export default ContextualExample;