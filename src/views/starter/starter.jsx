import React from 'react';
import zoomPlugin from "chartjs-plugin-zoom";
import {
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle,
    CardSubtitle,
    Button,
    Row,
    Col,
    Table
} from 'reactstrap';
import { Bar, Chart } from 'react-chartjs-2';
import Papa from "papaparse/papaparse.js";
import CountUp from 'react-countup';
import TableCovid from "../ui-components/tableCovid";


const Starter = () => {
    const [state, setState] = React.useState({allCases: null, last14Cases: null, cases: [], dates: [], totalCases: 0, newCases: 0, changes: 0, lastUpdate: null});
    const [isSending, setIsSending] = React.useState(false);
    const chartRef = React.useRef(null);

    async function getData() {
        const response = await fetch('https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/cases_malaysia.csv')
            .then(response => response.text())
            .then(v => Papa.parse(v, { header: true, skipEmptyLines: true }))
            .catch(err => console.log(err));

        const allCases = response.data;
        const cases = allCases.map(a => a.cases_new);
        const dates = allCases.map(a => a.date);
        const totalCases = allCases.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
        const lastUpdate = dates[dates.length - 1];
        const newCases = parseInt(cases[cases.length - 1]);
        const last2DayNewCases = parseInt(cases[cases.length - 2]);
        const changes = (newCases - last2DayNewCases) / last2DayNewCases * 100;
        const last14Cases = allCases.slice(-14);

        const resDeaths = await fetch('https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/deaths_malaysia.csv')
            .then(response => response.text())
            .then(v => Papa.parse(v, { header: true, skipEmptyLines: true }))
            .catch(err => console.log(err));

        const allCasesDeath = resDeaths.data;
        let casesDeath = allCasesDeath.map(a => a.deaths_new_dod);
        let missingDay = new Array(52).fill(0);
        if (dates.length !== casesDeath.length + missingDay.length) {
            console.warn("Error in Death cases calculation. It will not display!");
            casesDeath = [];
            missingDay = [];
        }

        setState({ allCases, last14Cases, cases, dates, totalCases, newCases, changes, lastUpdate, allCasesDeath, casesDeath: [...missingDay, ...casesDeath] });
    }

    React.useEffect(() => {
        Chart.register(zoomPlugin);
        getData();
    }, []);

    const reload = React.useCallback(async () => {
        if (isSending) return;
        setIsSending(true);
        await getData();
        setIsSending(false);
    }, [isSending]);

    const data = () => {
        //debugger;
        //console.log(state);
        return {
            labels: state.dates,
            datasets: [
                {
                    type: 'line',
                    label: '# of Death',
                    backgroundColor: "#666666",
                    data: state.casesDeath,
                    yAxisID: 'Line',
                },
                {
                    type: 'bar',
                    label: '# of Covid',
                    backgroundColor: "#f87979",
                    data: state.cases,
                    yAxisID: 'Bar',
                },                 
            ],
        };
    };

    const option = {
        scales: {
            Line: {
                position: 'right',
            }
        },
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true // SET SCROOL ZOOM TO TRUE
                    },
                    mode: "xy",
                    speed: 50
                },
                pan: {
                    enabled: true,
                    mode: "xy",
                    speed: 50
                }
            },
            /*legend: {
                display: false
            }*/
        },
    };

    const resetZoom = () => {
        chartRef.current.resetZoom()
    };

    const handleData = (month) => {
        let allCases, allCasesDeath, missingDay;
        let d = new Date();
        if (month === undefined)
        {
            allCases = state.allCases;
            allCasesDeath = state.allCasesDeath;
            missingDay = new Array(52).fill(0);
        }
        else
        {
            d.setMonth(d.getMonth() - month);
            allCases = state.allCases.filter(a => a.date >= d.toISOString().substr(0, 10));
            allCasesDeath = state.allCasesDeath.filter(a => a.date >= d.toISOString().substr(0, 10));
            missingDay = [];
        }
        const cases = allCases.map(a => a.cases_new);
        const dates = allCases.map(a => a.date);
        const totalCases = allCases.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
        const lastUpdate = dates[dates.length - 1];
        const newCases = parseInt(cases[cases.length - 1]);
        const last2DayNewCases = parseInt(cases[cases.length - 2]);
        const changes = (newCases - last2DayNewCases) / last2DayNewCases * 100;
        const last14Cases = allCases.slice(-14);

        const casesDeath = allCasesDeath.map(a => a.deaths_new_dod);
        if (dates.length !== casesDeath.length + missingDay.length) {
            console.warn("Error in Death cases calculation. It will not display!");
            casesDeath = [];
            missingDay = [];
        }

        setState({ allCases: state.allCases, last14Cases, cases, dates, totalCases, newCases, changes, lastUpdate, allCasesDeath: state.allCasesDeath, casesDeath: [...missingDay, ...casesDeath] });
    }

    return (
        <div>
            <Row>
                <Col sm={6} lg={3}>
                    <Card className="card-stats">
                        <CardBody>
                            <Row>
                                <div className="col">
                                    <CardTitle
                                        tag="h5"
                                        className="text-uppercase text-muted mb-0"
                                    >
                                        Last Update
                                    </CardTitle>
                                    <span className="h3 font-weight-bold mb-0">
                                        {state.lastUpdate !== null ? state.lastUpdate : '-'}
                                    </span>
                                </div>
                                <Col className="col-auto">
                                    <div className="icon icon-shape rounded-circle shadow">
                                        <i className="fas fa-calendar" />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={6} lg={3}>
                    <Card className="card-stats">
                        <CardBody>
                            <Row>
                                <div className="col">
                                    <CardTitle
                                        tag="h5"
                                        className="text-uppercase text-muted mb-0"
                                    >
                                        Total cases
                                    </CardTitle>
                                    <CountUp className="h3 font-weight-bold mb-0"  style={{ color: 'blue' }} end={state.totalCases} separator=","  decimals={0}  decimal="," duration={2} />
                                </div>
                                <Col className="col-auto">
                                    <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                        <i className="fas fa-chart-bar" />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={6} lg={3}>
                    <Card className="card-stats">
                        <CardBody>
                            <Row>
                                <div className="col">
                                    <CardTitle
                                        tag="h5"
                                        className="text-uppercase text-muted mb-0"
                                    >
                                        New cases
                                    </CardTitle>
                                    <span className="h3 font-weight-bold mb-0" style={{ color: 'red' }}>
                                        <i className="fas fa-arrow-up" />
                                    </span>
                                    <CountUp className="h3 font-weight-bold mb-0" style={{ color: 'red' }} end={state.newCases} separator=","  decimals={0}  decimal="," duration={2} />                                        
                                </div>
                                <Col className="col-auto">
                                    <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                        <i className="fas fa-chart-pie" />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={6} lg={3}>
                    <Card className="card-stats">
                        <CardBody>
                            <Row>
                                <div className="col">
                                    <CardTitle
                                        tag="h5"
                                        className="text-uppercase text-muted mb-0"
                                    >
                                        Daily Changes
                                    </CardTitle>
                                    <span className="h3 font-weight-bold mb-0" 
                                        style={state.changes > 0 ? { color: 'red' } : { color: 'green' }}>
                                        <i className={state.changes > 0 ? "fas fa-arrow-up": "fas fa-arrow-down"} />
                                        {state.changes.toLocaleString(undefined, {maximumFractionDigits:2})}%
                                    </span>
                                </div>
                                <Col className="col-auto">
                                    <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                                        <i className="fas fa-percent" />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={7} md={12}>
                    <div className='header'>
                        <h1 className='title'>Malaysia Covid 19 Daily New Cases</h1>
                    </div>
                </Col>
                <Col lg={5} md={12} className="text-right">
                    <Button color="primary" onClick={() => handleData()} style={{ marginRight: '3px'}}>All</Button>
                    <Button color="primary" onClick={() => handleData(6)} style={{ marginRight: '3px'}}>6 Months</Button>
                    <Button color="primary" onClick={() => handleData(3)} style={{ marginRight: '3px'}}>3 Months</Button>
                    <Button onClick={resetZoom} style={{ marginRight: '3px'}}>Reset zoom</Button>
                    <Button color="warning" disabled={isSending} onClick={reload}>Reload</Button>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Bar ref={chartRef} data={data} options={option} className="mb-xl-4" />
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <TableCovid data={state.last14Cases} />
                </Col>
            </Row>
            <Row>
                <Col className="text-right">
                <a style={{color: 'white'}} href="#/DataMalaysia"><Button color="info">More Detail</Button></a>
                </Col>
            </Row>
        </div>
    );
}

export default Starter;
