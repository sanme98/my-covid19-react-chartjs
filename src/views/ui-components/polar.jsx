import React from 'react';
import { PolarArea } from 'react-chartjs-2';
import {
    Row,
    Col
} from 'reactstrap';

const Polar = (props) => (
    <>
        <Row>
        <Col md={0} lg={2}></Col>
        <Col md={12} lg={8}>
            <PolarArea data={props.data} />
        </Col>
        <Col md={0} lg={2}></Col>
        </Row>
    </>
);

export default Polar;