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

const KlangValley = () => {
    const [state, setState] = React.useState({casesKV: null, cases: [], dates: [], totalCases: 0, newCases: 0, changes: 0, lastUpdate: null, accumulativeCases: null});

    const chartRef = React.useRef(null);

    React.useEffect(() => {
        Chart.register(zoomPlugin);
        async function getData() {
            const response = await fetch('https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/cases_state.csv')
                .then(response => response.text())
                .then(v => Papa.parse(v, { header: true, skipEmptyLines: true }))
                .catch(err => console.log(err));

            const casesKV = response.data.filter(a => a.state === "Selangor" || a.state === "W.P. Kuala Lumpur" || a.state === "W.P. Putrajaya");

            const dates = casesKV.map(a => a.date);

            const newCasesKV = casesKV.filter(a => a.date === dates[dates.length - 1]);
            const last2DayNewCasesKV = casesKV.filter(a => a.date === dates[dates.length - 4]);
            const cases = casesKV.map(a => a.cases_new);

            let totalCases = casesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
            let lastUpdate = dates[dates.length - 1];
            let newCases = newCasesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
            let last2DayNewCases = last2DayNewCasesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
            let changes = (newCases - last2DayNewCases) / last2DayNewCases * 100;

            /*
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
            */

            const resDeaths = await fetch('https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/deaths_state.csv')
                .then(res => res.text())
                .then(v => Papa.parse(v, { header: true, skipEmptyLines: true }))
                .catch(err => console.log(err));

            const allCasesDeath = resDeaths.data.filter(a => a.state === "Selangor" || a.state === "W.P. Kuala Lumpur" || a.state === "W.P. Putrajaya");
            const allGroupCasesDeath = groupBy(allCasesDeath, 'date');
            let sumDeath = Object.fromEntries(Object.entries(allGroupCasesDeath).map(([k, v]) => [k, 
                v.reduce(function (prev, curr) { return parseInt(prev) + parseInt(curr.deaths_new_dod); }, 0)]));

            let casesDeath = Object.values(sumDeath);
            let missingDay = new Array(52).fill(0);
            if (dates.length/3 !== casesDeath.length + missingDay.length) {
                console.warn("Error in Death cases calculation. It will not display!");
                casesDeath = [];
                missingDay = [];
            }

            setState({ allCases: casesKV, casesKV, cases, dates, totalCases, newCases, changes, lastUpdate, allCasesDeath, casesDeath: [...missingDay, ...casesDeath] });
        }
        getData();
    }, []);

    const groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const data = () => {
        const casesSelangor = state.casesKV != null ? state.casesKV.filter(a => a.state === "Selangor").map(a => a.cases_new) : [];
        const casesKL = state.casesKV != null ? state.casesKV.filter(a => a.state === "W.P. Kuala Lumpur").map(a => a.cases_new) : [];
        const casesPutrajaya = state.casesKV != null ? state.casesKV.filter(a => a.state === "W.P. Putrajaya").map(a => a.cases_new) : [];
        const dates = state.casesKV != null ? state.casesKV.filter(a => a.state === "Selangor").map(a => a.date) : [];

        return {
            labels: dates,
            datasets: [
                /*
                {
                    type: 'line',
                    label: 'Accumulate Cases',
                    //backgroundColor: "#666666",
                    data: state.accumulativeCases,
                    yAxisID: 'Line',
                },
                */
                {
                    type: 'line',
                    label: '# of Death',
                    backgroundColor: "#666666",
                    data: state.casesDeath,
                    yAxisID: 'Line',
                },
                {
                    type: 'bar',
                    label: 'Selangor',
                    backgroundColor: "#f87979",
                    data: casesSelangor
                },
                {
                    type: 'bar',
                    label: 'Kuala Lumpur',
                    backgroundColor: "#007979",
                    data: casesKL
                },
                {
                    type: 'bar',
                    label: 'Putrajaya',
                    backgroundColor: "#000079",
                    data: casesPutrajaya
                },
            ],
        }
    };

    const resetZoom = () => {
        chartRef.current.resetZoom()
    };

    const handleData = (month) => {
        let casesKV, allCasesDeath, missingDay;
        let d = new Date();
        if (month === undefined)
        {
            casesKV = state.allCases;
            allCasesDeath = state.allCasesDeath;
            missingDay = new Array(52).fill(0);
        }
        else 
        {
            d.setMonth(d.getMonth() - month);
            casesKV = state.allCases.filter(a => a.date >= d.toISOString().substr(0, 10));
            allCasesDeath = state.allCasesDeath.filter(a => a.date >= d.toISOString().substr(0, 10));
            missingDay = [];
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

        /*
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
        */

        const allGroupCasesDeath = groupBy(allCasesDeath, 'date');
        let sumDeath = Object.fromEntries(Object.entries(allGroupCasesDeath).map(([k, v]) => [k,
            v.reduce(function (prev, curr) { return parseInt(prev) + parseInt(curr.deaths_new_dod); }, 0)]));

        const casesDeath = Object.values(sumDeath);
        if (dates.length/3 !== casesDeath.length + missingDay.length) {
            console.warn("Error in Death cases calculation. It will not display!");
            casesDeath = [];
            missingDay = [];
        }

        setState({ allCases: state.allCases, casesKV, cases, dates, totalCases, newCases, changes, lastUpdate, allCasesDeath: state.allCasesDeath, casesDeath: [...missingDay, ...casesDeath] });
    }

    const isMobile = () => {
        return window.screen.width <= 760;
    }

    const option = {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
            Line: {
                position: 'right',
            }
        },
        maintainAspectRatio: true,
        responsive: true,
        animation: {
            duration: 0
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true, // SET SCROOL ZOOM TO TRUE
                        modifierKey: 'shift'
                    },
                    mode: "xy",
                    speed: 50,
                },
                pan: {
                    enabled: !isMobile(),
                    mode: "xy",
                    speed: 50,
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
                        <h2 className='title'>Klang Valley Covid-19 Daily New Cases</h2>
                    </div>
                </Col>
                <Col lg={5} md={12} className="text-right">
                    <Button color="primary" onClick={() => handleData()} style={{ marginRight: '3px'}}>All</Button>
                    <Button color="primary" onClick={() => handleData(6)} style={{ marginRight: '3px'}}>6 Months</Button>
                    <Button color="primary" onClick={() => handleData(3)} style={{ marginRight: '3px'}}>3 Months</Button>
                    <Button title="Shift key to zoom" onClick={resetZoom} style={{display: isMobile() ? 'none' : 'inline-block' }}>Reset zoom</Button>
                </Col>
            </Row>
            <Row>
                <Col sm={12} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                    <Bar ref={chartRef} data={data} options={option} className="mb-xl-4" />
                </Col>
            </Row>
        </div>
    );
}

export default KlangValley;
