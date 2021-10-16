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
    Col
} from 'reactstrap';
import { Bar, Chart } from 'react-chartjs-2';
import Papa from "papaparse/papaparse.js";
import CountUp from 'react-countup';

const EastMalaysia = () => {
    const [state, setState] = React.useState({casesKV: null, cases: [], dates: [], totalCases: 0, newCases: 0, changes: 0, lastUpdate: null, accumulativeCases: null});

    const chartRef = React.useRef(null);

    React.useEffect(() => {
        Chart.register(zoomPlugin);
        async function getData() {
            const response = await fetch('https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/cases_state.csv')
                .then(response => response.text())
                .then(v => Papa.parse(v, { header: true, skipEmptyLines: true }))
                .catch(err => console.log(err));

            const casesKV = response.data.filter(a => a.state === "Sabah" || a.state === "Sarawak" || a.state === "W.P. Labuan");

            const dates = casesKV.map(a => a.date);

            const newCasesKV = casesKV.filter(a => a.date === dates[dates.length - 1]);
            const last2DayNewCasesKV = casesKV.filter(a => a.date === dates[dates.length - 4]);
            const cases = casesKV.map(a => a.cases_new);

            let totalCases = casesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
            let lastUpdate = dates[dates.length - 1];
            let newCases = newCasesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
            let last2DayNewCases = last2DayNewCasesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
            let changes = (newCases - last2DayNewCases) / last2DayNewCases * 100;

            let accumulativeCases = [];
            let accumulateAmount = 0;
            for (var num = 0; num < cases.length; num++) {
                accumulateAmount += parseInt(cases[num]);
                if (num !== 0 && (num + 1) % 3 === 0) {
                    accumulativeCases.push(accumulateAmount);
                }
            }
            if (totalCases !== accumulateAmount) {
                console.warn("Error in Accumulate cases calculation. It will not display!");
                accumulativeCases = [];
            }

            setState({ allCases: casesKV, casesKV, cases, dates, totalCases, newCases, changes, lastUpdate, accumulativeCases });
        }
        getData();
    }, []);

    const data = () => {
        const casesSabah = state.casesKV != null ? state.casesKV.filter(a => a.state === "Sabah").map(a => a.cases_new) : [];
        const casesSarawak = state.casesKV != null ? state.casesKV.filter(a => a.state === "Sarawak").map(a => a.cases_new) : [];
        const casesLabuan = state.casesKV != null ? state.casesKV.filter(a => a.state === "W.P. Labuan").map(a => a.cases_new) : [];
        const dates = state.casesKV != null ? state.casesKV.filter(a => a.state === "Sabah").map(a => a.date) : [];

        return {
            labels: dates,
            datasets: [
                {
                    type: 'line',
                    label: 'Accumulate Cases',
                    //backgroundColor: "#666666",
                    data: state.accumulativeCases,
                    yAxisID: 'Line',
                },
                {
                    label: 'Sabah',
                    backgroundColor: "#f87979",
                    data: casesSabah
                },
                {
                    label: 'Sarawak',
                    backgroundColor: "#007979",
                    data: casesSarawak
                },
                {
                    label: 'Labuan',
                    backgroundColor: "#000079",
                    data: casesLabuan
                },
            ],
        }
    };

    const resetZoom = () => {
        chartRef.current.resetZoom()
    };

    const handleData = (month) => {
        let casesKV;
        let d = new Date();
        if (month === undefined)
        {
            casesKV = state.allCases;
        }
        else
        {
            d.setMonth(d.getMonth() - month);
            casesKV = state.allCases.filter(a => a.date >= d.toISOString().substr(0, 10));
        }

        const dates = casesKV.map(a => a.date);

        const newCasesKV = casesKV.filter(a => a.date === dates[dates.length - 1]);
        const last2DayNewCasesKV = casesKV.filter(a => a.date === dates[dates.length - 4]);
        const cases = casesKV.map(a => a.cases_new);

        let totalCases = casesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
        let lastUpdate = dates[dates.length - 1];
        let newCases = newCasesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
        let last2DayNewCases = last2DayNewCasesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
        let changes = (newCases - last2DayNewCases) / last2DayNewCases * 100;

        let accumulativeCases = [];
        let accumulateAmount = 0;
        for (var num = 0; num < cases.length; num++) {
            accumulateAmount += parseInt(cases[num]);
            if (num !== 0 && (num + 1) % 3 === 0) {
                accumulativeCases.push(accumulateAmount);
            }
        }
        if (totalCases !== accumulateAmount) {
            console.warn("Error in Accumulate cases calculation. It will not display!");
            accumulativeCases = [];
        }

        setState({ allCases: state.allCases, casesKV, cases, dates, totalCases, newCases, changes, lastUpdate, accumulativeCases });
    }

    const option = {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true
            },
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
            legend: {
                onClick: null
            }
        }
    };

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
                                    <CountUp className="h3 font-weight-bold mb-0" style={{ color: 'blue' }} end={state.totalCases} separator=","  decimals={0}  decimal="," duration={2} />
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
                        <h1 className='title'>East Malaysia Covid 19 Daily New Cases</h1>
                    </div>
                </Col>
                <Col lg={5} md={12} className="text-right">
                    <Button color="primary" onClick={() => handleData()} style={{ marginRight: '3px'}}>All</Button>
                    <Button color="primary" onClick={() => handleData(6)} style={{ marginRight: '3px'}}>6 Months</Button>
                    <Button color="primary" onClick={() => handleData(3)} style={{ marginRight: '3px'}}>3 Months</Button>
                    <Button onClick={resetZoom}>Reset zoom</Button>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Bar ref={chartRef} data={data} options={option} className="mb-xl-4" />
                </Col>
            </Row>
        </div>
    );
}

export default EastMalaysia;
