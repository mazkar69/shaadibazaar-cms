import React from 'react';
import Chart from 'react-apexcharts';
import { Panel, Loader } from 'rsuite';

const ConversionByPieChart = ({ data, loading }) => {
    // Handle loading state
    if (loading) {
        return (
            <Panel bordered header="Conversion By Type" className="card">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    <Loader size="md" content="Loading..." />
                </div>
            </Panel>
        );
    }

    // Handle empty/no-data state
    if (!data || data.length === 0) {
        return (
            <Panel bordered header="Conversion By Type" className="card">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, color: '#888' }}>
                    No data available
                </div>
            </Panel>
        );
    }

    const labels = data.map(item => item.conversion_by);
    const series = data.map(item => item.totalCount);

    const options = {
        chart: {
            type: 'pie',
        },
        labels: labels,
        legend: {
            position: 'bottom',
        },
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 280
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <Panel bordered header="Conversion By Type" className="card">
            <Chart
                options={options}
                series={series}
                type="pie"
                height={300}
            />
        </Panel>
    );
};

export default ConversionByPieChart;
