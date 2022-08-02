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
import { Bar, Chart, Line } from 'react-chartjs-2';
import Papa from "papaparse/papaparse.js";
import CountUp from 'react-countup';
import Polar from '../ui-components/polar';

const WestMalaysia = () => {
    const [state, setState] = React.useState({casesKV: null, cases: [], dates: [], totalCases: 0, newCases: 0, changes: 0, lastUpdate: null, accumulativeCases: []});

    const chartRef = React.useRef(null);

    React.useEffect(() => {
        Chart.register(zoomPlugin);
        async function getData() {
            const response = await fetch('https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/cases_state.csv')
                .then(res => res.text())
                .then(v => Papa.parse(v, { header: true, skipEmptyLines: true }))
                .catch(err => console.log(err));

            const casesKV = response.data.filter(a => (a.state !== "Sabah" && a.state !== "Sarawak" && a.state !== "W.P. Labuan"));

            const dates = casesKV.map(a => a.date);

            const newCasesKV = casesKV.filter(a => a.date === dates[dates.length - 1]);
            const last2DayNewCasesKV = casesKV.filter(a => a.date === dates[dates.length - 14]);
            const cases = casesKV.map(a => a.cases_new);

            let totalCases = casesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
            let lastUpdate = dates[dates.length - 1];
            let newCases = newCasesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
            let last2DayNewCases = last2DayNewCasesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
            let changes = (newCases - last2DayNewCases) / last2DayNewCases * 100;

            let accumulativeCases = [];
            let accumulateAmount = 0;
            for (let num = 0; num < cases.length; num++) {
                accumulateAmount += parseInt(cases[num]);
                if (num !== 0 && (num + 1) % 13 === 0) {
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

    const dataPolar = () => {
        //debugger;
        let casesSelangor = state.casesKV != null ? state.casesKV.filter(a => a.state === "Selangor").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesKL = state.casesKV != null ? state.casesKV.filter(a => a.state === "W.P. Kuala Lumpur").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesPutrajaya = state.casesKV != null ? state.casesKV.filter(a => a.state === "W.P. Putrajaya").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesJohor = state.casesKV != null ? state.casesKV.filter(a => a.state === "Johor").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesKedah = state.casesKV != null ? state.casesKV.filter(a => a.state === "Kedah").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesKelantan = state.casesKV != null ? state.casesKV.filter(a => a.state === "Kelantan").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesMelaka = state.casesKV != null ? state.casesKV.filter(a => a.state === "Melaka").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesSembilan = state.casesKV != null ? state.casesKV.filter(a => a.state === "Negeri Sembilan").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesPahang = state.casesKV != null ? state.casesKV.filter(a => a.state === "Pahang").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesPerak = state.casesKV != null ? state.casesKV.filter(a => a.state === "Perak").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesPerlis = state.casesKV != null ? state.casesKV.filter(a => a.state === "Perlis").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesPenang = state.casesKV != null ? state.casesKV.filter(a => a.state === "Pulau Pinang").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;
        const casesTerengganu = state.casesKV != null ? state.casesKV.filter(a => a.state === "Terengganu").map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0) : 0;

        //console.log([casesSelangor, casesKL, casesPutrajaya, casesJohor, casesKedah, casesKelantan, casesMelaka, casesSembilan, casesPahang, casesPerak, casesPerlis, casesPenang, casesTerengganu]);
        return {
            labels: ['Selangor', 'Kuala Lumpur', 'Putrajaya', 'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Sembilan', 'Pahang', 'Perak', 'Perlis', 'Penang', 'Terengganu'],
            datasets: [
                {
                    data: [casesSelangor, casesKL, casesPutrajaya, casesJohor, casesKedah, casesKelantan, casesMelaka, casesSembilan, casesPahang, casesPerak, casesPerlis, casesPenang, casesTerengganu],
                    label: '# of Cases',
                    backgroundColor: [
                        'rgba(248, 121, 121, 0.5)',
                        'rgba(0, 121, 121, 0.5)',
                        'rgba(0, 0, 121, 0.5)',
                        'rgba(204, 255, 0, 0.5)',
                        'rgba(0, 0, 0, 0.5)',
                        'rgba(51, 102, 255, 0.5)',

                        'rgba(204, 204, 0, 0.5)',
                        'rgba(204, 204, 255, 0.5)',
                        'rgba(255, 204, 153, 0.5)',
                        'rgba(204, 153, 102, 0.5)',
                        'rgba(204, 153, 255, 0.5)',
                        'rgba(102, 0, 0, 0.5)',

                        'rgba(51, 51, 51, 0.5)',
                    ],
                    borderWidth: 1,
                }
            ],
        };
    };

    const data = () => {
        const casesSelangor = state.casesKV != null ? state.casesKV.filter(a => a.state === "Selangor").map(a => a.cases_new) : [];
        const casesKL = state.casesKV != null ? state.casesKV.filter(a => a.state === "W.P. Kuala Lumpur").map(a => a.cases_new) : [];
        const casesPutrajaya = state.casesKV != null ? state.casesKV.filter(a => a.state === "W.P. Putrajaya").map(a => a.cases_new) : [];
        const casesJohor = state.casesKV != null ? state.casesKV.filter(a => a.state === "Johor").map(a => a.cases_new) : [];
        const casesKedah = state.casesKV != null ? state.casesKV.filter(a => a.state === "Kedah").map(a => a.cases_new) : [];
        const casesKelantan = state.casesKV != null ? state.casesKV.filter(a => a.state === "Kelantan").map(a => a.cases_new) : [];
        const casesMelaka = state.casesKV != null ? state.casesKV.filter(a => a.state === "Melaka").map(a => a.cases_new) : [];
        const casesSembilan = state.casesKV != null ? state.casesKV.filter(a => a.state === "Negeri Sembilan").map(a => a.cases_new) : [];
        const casesPahang = state.casesKV != null ? state.casesKV.filter(a => a.state === "Pahang").map(a => a.cases_new) : [];
        const casesPerak = state.casesKV != null ? state.casesKV.filter(a => a.state === "Perak").map(a => a.cases_new) : [];
        const casesPerlis = state.casesKV != null ? state.casesKV.filter(a => a.state === "Perlis").map(a => a.cases_new) : [];
        const casesPenang = state.casesKV != null ? state.casesKV.filter(a => a.state === "Pulau Pinang").map(a => a.cases_new) : [];
        const casesTerengganu = state.casesKV != null ? state.casesKV.filter(a => a.state === "Terengganu").map(a => a.cases_new) : [];

        const dates = state.casesKV != null ? state.casesKV.filter(a => a.state === "Selangor").map(a => a.date) : [];

        return {
            labels: dates,
            datasets: [
                {
                    label: 'Selangor',
                    backgroundColor: "#f87979",
                    data: casesSelangor
                },
                {
                    label: 'Kuala Lumpur',
                    backgroundColor: "#007979",
                    data: casesKL
                },
                {
                    label: 'Putrajaya',
                    backgroundColor: "#000079",
                    data: casesPutrajaya
                },
                {
                    label: 'Johor',
                    backgroundColor: "#CCFF00",
                    data: casesJohor
                },
                {
                    label: 'Kedah',
                    backgroundColor: "#000000",
                    data: casesKedah
                },
                {
                    label: 'Kelantan',
                    backgroundColor: "#3366FF",
                    data: casesKelantan
                },

                {
                    label: 'Melaka',
                    backgroundColor: "#CCCC00",
                    data: casesMelaka
                },
                {
                    label: 'Sembilan',
                    backgroundColor: "#CCCCFF",
                    data: casesSembilan
                },
                {
                    label: 'Pahang',
                    backgroundColor: "#FFCC99",
                    data: casesPahang
                },
                {
                    label: 'Perak',
                    backgroundColor: "#CC9966",
                    data: casesPerak
                },
                {
                    label: 'Perlis',
                    backgroundColor: "#CC99FF",
                    data: casesPerlis
                },
                {
                    label: 'Pulau Pinang',
                    backgroundColor: "#660000",
                    data: casesPenang
                },

                {
                    label: 'Terengganu',
                    backgroundColor: "#333333",
                    data: casesTerengganu
                },
            ],
        }
    };

    const resetZoom = () => {
        chartRef.current.resetZoom()
    };

    const handleData = (month) => {
        //debugger;
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
        const last2DayNewCasesKV = casesKV.filter(a => a.date === dates[dates.length - 14]);
        const cases = casesKV.map(a => a.cases_new);

        let totalCases = casesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
        let lastUpdate = dates[dates.length - 1];
        let newCases = newCasesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
        let last2DayNewCases = last2DayNewCasesKV.map(item => parseInt(item.cases_new) || 0).reduce((prev, curr) => prev + curr, 0);
        let changes = (newCases - last2DayNewCases) / last2DayNewCases * 100;

        let accumulativeCases = [];
        let accumulateAmount = 0;
        for (let num = 0; num < cases.length; num++) {
            accumulateAmount += parseInt(cases[num]);
            if (num !== 0 && (num + 1) % 13 === 0) {
                accumulativeCases.push(accumulateAmount);
            }
        }
        if (totalCases !== accumulateAmount) {
            console.warn("Error in Accumulate cases calculation. It will not display!");
            accumulativeCases = [];
        }

        setState({ allCases: state.allCases, casesKV, cases, dates, totalCases, newCases, changes, lastUpdate, accumulativeCases });
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
                stacked: true
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
                    speed: 50
                },
                pan: {
                    enabled: !isMobile(),
                    mode: "xy",
                    speed: 50
                }
            }
        }
    };

    const dataLine = () => {
        const dates = state.casesKV != null ? state.casesKV.filter(a => a.state === "Selangor").map(a => a.date) : [];

        return {
            labels: dates,
            datasets: [
                {
                    label: 'Accumulate Cases',
                    backgroundColor: "#f87979",
                    data: state.accumulativeCases
                }
            ],
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
                <Col xl={7} lg={12}>
                    <div className='header'>
                        <h2 className='title'>West Malaysia Covid-19 Daily New Cases</h2>
                    </div>
                </Col>
                <Col xl={5} lg={12} className="text-right">
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
            <Row>
                <Col md={5}>
                    <Polar data={dataPolar} />
                </Col>
                <Col md={7}>
                    <Line data={dataLine} />
                </Col>
            </Row>
        </div>
    );
}

export default WestMalaysia;
