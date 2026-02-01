import React from 'react';
import Chart from 'react-apexcharts';
import { Panel, Loader } from 'rsuite';

const Top20VendorsChart = ({ data, loading }) => {
    // Handle loading state
    if (loading) {
        return (
            <Panel bordered header="Top 20 Vendors" className="card">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <Loader size="md" content="Loading..." />
                </div>
            </Panel>
        );
    }

    // Handle empty/no-data state
    if (!data || data.length === 0) {
        return (
            <Panel bordered header="Top 20 Vendors" className="card">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, color: '#888' }}>
                    No data available
                </div>
            </Panel>
        );
    }

    // Data is already sorted, do not re-sort
    const categories = data.map(item => item.slug);
    const seriesData = data.map(item => item.count);

    const options = {
        chart: {
            type: 'bar',
            toolbar: {
                show: true
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                barHeight: '70%',
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val;
            },
            style: {
                fontSize: '11px',
            }
        },
        xaxis: {
            categories: categories,
            title: {
                text: 'Conversion Count'
            }
        },
        yaxis: {
            title: {
                text: 'Vendor'
            },
            labels: {
                maxWidth: 200,
                style: {
                    fontSize: '11px'
                }
            }
        },
        colors: ['#00E396'],
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + ' conversions';
                }
            }
        }
    };

    const series = [{
        name: 'Conversions',
        data: seriesData
    }];

    return (
        <Panel bordered header="Top 20 Vendors" className="card">
            <Chart
                options={options}
                series={series}
                type="bar"
                height={500}
            />
        </Panel>
    );
};

export default Top20VendorsChart;
