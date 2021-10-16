import React from 'react';
import {
    Card,
    CardImg,
    CardImgOverlay,
    CardText,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardColumns,
    CardGroup,
    CardDeck,
    CardLink,
    CardHeader,
    CardFooter,
    Button,
    Row,
    Col,
    ListGroup, 
    ListGroupItem
} from 'reactstrap';

import img1 from '../../assets/images/coronavirus.png';

const About = () => {
    return (
        <div>
            <Row>
                <Col lg={3} />
                <Col lg={6}>
                <h2 className="mb-3">About</h2>
                    <Card>                        
                        <CardImg top src={img1} />
                        <CardBody>
                            <p className="lead">This is just another simple site with source code to learn React Hook, Bootstrap, and Chart.js</p>
                            <CardText>The data for this site is from <a href="https://github.com/MoH-Malaysia/covid19-public" target="_blank">Open data on COVID-19 in Malaysia</a> and this site will do some simple calculations to display the data. Please <a href="https://github.com/sanme98/my-covid19-react-chartjs/issues" target="_blank">report the issue</a> if you found any bugs or miscalculations on this site, or even better, please fork the source code on Github, fix the bugs and contribute to the project.</CardText>
                            <CardTitle>Disclaimer</CardTitle>
                            <CardText>Please visit Covid-19 Data Official site for accurate Covid-19 information. This site is just for educational and learning purposes only. It has not gone through any rigorous QA and testing, so it might still have some bugs or miscalculations.</CardText>
                            <CardTitle>Project Github URL</CardTitle>
                            <CardText><a href="https://github.com/sanme98/my-covid19-react-chartjs" target="_blank">https://github.com/sanme98/my-covid19-react-chartjs</a></CardText>
                            <CardText>Please head to <a href="https://mycsharpdeveloper.wordpress.com/2021/10/16/malaysia-covid-19-daily-new-cases-using-react-hook-and-chart-js" target="_blank">Malaysia Covid-19 Daily New Cases using React Hook and Chart.js</a> for some brief explanations.</CardText>
                            <CardTitle>License</CardTitle>
                            <CardText><a href="https://github.com/sanme98/my-covid19-react-chartjs/blob/master/LICENSE" target="_blank">MIT License</a></CardText>
                            <CardTitle>Credit / Some Libraries Used</CardTitle>
                            <ListGroup>
                                <ListGroupItem><a href="https://github.com/MoH-Malaysia/covid19-public" target="_blank">Open data on COVID-19 in Malaysia</a></ListGroupItem>
                                <ListGroupItem><a href="https://github.com/wrappixel/xtreme-react-lite" target="_blank">Xtreme React Admin Lite</a></ListGroupItem>
                                <ListGroupItem><a href="https://reactjs.org/" target="_blank">React</a></ListGroupItem>
                                <ListGroupItem><a href="https://getbootstrap.com/" target="_blank">Bootstrap</a></ListGroupItem>
                                <ListGroupItem><a href="https://reactstrap.github.io/" target="_blank">reactstrap</a></ListGroupItem>
                                <ListGroupItem><a href="https://www.chartjs.org/" target="_blank">Chart.js</a></ListGroupItem>
                                <ListGroupItem><a href="https://www.chartjs.org/chartjs-plugin-zoom/" target="_blank">chartjs-plugin-zoom</a></ListGroupItem>
                                <ListGroupItem><a href="https://www.papaparse.com/" target="_blank">Papa Parse</a></ListGroupItem>
                                <ListGroupItem><a href="https://github.com/reactchartjs/react-chartjs-2" target="_blank">react-chartjs-2</a></ListGroupItem>
                                <ListGroupItem><a href="https://github.com/glennreyes/react-countup" target="_blank">react-countup</a></ListGroupItem>
                                <ListGroupItem><a href="https://github.com/Bunlong/react-papaparse" target="_blank">react-papaparse</a></ListGroupItem>
                                <ListGroupItem><a href="https://react-table.tanstack.com/" target="_blank">react-table</a></ListGroupItem>                             
                                <ListGroupItem>...</ListGroupItem>
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={3} />
            </Row>
        </div>
    );
}

export default About;


