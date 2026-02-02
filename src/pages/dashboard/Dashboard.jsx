import React, { useState, useEffect } from 'react';
import { Row, Col, DateRangePicker, Stack, Panel } from 'rsuite';
import { authApi } from '../../utils/request/apiRequest.js';

// Import chart components
import ConversionByPieChart from './ConversionByPieChart.jsx';
import SourceWisePieChart from './SourceWisePieChart.jsx';
import PlatformWisePieChart from './PlatformWisePieChart.jsx';
import Top20VenuesChart from './Top20VenuesChart.jsx';
import Top20VendorsChart from './Top20VendorsChart.jsx';
import VenueLocalitiesChart from './VenueLocalitiesChart.jsx';
import VendorLocalitiesChart from './VendorLocalitiesChart.jsx';

// Helper to format date as YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get default date range (last 30 days)
const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  // startDate.setDate(startDate.getDate() - 30);
  return [startDate, endDate];
};

const Dashboard = () => {
  // Global date range state
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  // Count data states
  const [countData, setCountData] = useState({
    totalConversions: 0,
    totalLead: 0,
    visits: 0,
    queries: 0
  });

  // Pie chart data states
  const [pieChartData, setPieChartData] = useState({
    conversion_by_group: [],
    source_group: [],
    platform_group: []
  });
  const [pieChartLoading, setPieChartLoading] = useState(false);

  // Top 20 data states
  const [top20Data, setTop20Data] = useState({
    venue: [],
    vendor: []
  });
  const [top20Loading, setTop20Loading] = useState(false);

  // Locality data states
  const [localityData, setLocalityData] = useState({
    venueLocalities: [],
    vendorLocalities: []
  });
  const [localityLoading, setLocalityLoading] = useState(false);


  // Fetch Count Data
  const fetchCountData = async (startDate, endDate) => {
    try {
      const url = `/api/analysis/count-data?startDate=${startDate}&endDate=${endDate}`;
      const { data } = await authApi.get(url);

      if(data?.data){
        setCountData({
          totalConversions: data.data.totalConversions || 0,
          totalLead: data.data.totalLead || 0,
          visits: data.data.visits || 0,
          queries: data.data.queries || 0
        });
      }
    } catch (error) {
      console.error('Error fetching count data:', error);
      setCountData({
        totalConversions: 0,
        totalLead: 0,
        visits: 0,
        queries: 0
      });
    }

  
  };

  // Fetch pie chart data
  const fetchPieChartData = async (startDate, endDate) => {
    try {
      setPieChartLoading(true);
      const url = `/api/analysis/pie-chart-data?startDate=${startDate}&endDate=${endDate}`;
      const { data } = await authApi.get(url);

      if (data?.data) {
        setPieChartData({
          conversion_by_group: data.data.conversion_by_group || [],
          source_group: data.data.source_group || [],
          platform_group: data.data.platform_group || []
        });
      }
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
      setPieChartData({
        conversion_by_group: [],
        source_group: [],
        platform_group: []
      });
    } finally {
      setPieChartLoading(false);
    }
  };

  // Fetch top 20 data
  const fetchTop20Data = async (startDate, endDate) => {
    try {
      setTop20Loading(true);
      const url = `/api/analysis/top20?startDate=${startDate}&endDate=${endDate}`;
      const { data } = await authApi.get(url);

      if (data?.data) {
        setTop20Data({
          venue: data.data.venue || [],
          vendor: data.data.vendor || []
        });
      }
    } catch (error) {
      console.error('Error fetching top 20 data:', error);
      setTop20Data({
        venue: [],
        vendor: []
      });
    } finally {
      setTop20Loading(false);
    }
  };

  // Fetch locality data
  const fetchLocalityData = async (startDate, endDate) => {
    try {
      setLocalityLoading(true);
      const url = `/api/analysis/top20Locality?startDate=${startDate}&endDate=${endDate}`;
      const { data } = await authApi.get(url);

      if (data?.data) {
        setLocalityData({
          venueLocalities: data.data.venueLocalitiesFinalData || [],
          vendorLocalities: data.data.vendorLocalitiesFinalData || []
        });
      }
    } catch (error) {
      console.error('Error fetching locality data:', error);
      setLocalityData({
        venueLocalities: [],
        vendorLocalities: []
      });
    } finally {
      setLocalityLoading(false);
    }
  };

  // Fetch data when date range changes
  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = formatDate(dateRange[0]);
      const endDate = formatDate(dateRange[1]);

      fetchCountData(startDate, endDate);
      fetchPieChartData(startDate, endDate);
      fetchTop20Data(startDate, endDate);
      fetchLocalityData(startDate, endDate);
    }
  }, [dateRange]);

  // Handle date range change
  const handleDateRangeChange = (value) => {
    if (value) {
      setDateRange(value);
    }
  };

  return (
    <>

      {/* Global Date Filter */}
      <Stack justifyContent="flex-start" style={{ marginBottom: 30, marginTop: 30 }}>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          placeholder="Select Date Range"
          format="yyyy-MM-dd"
          cleanable={false}
          size="md"
          style={{ width: 280 }}
        />
      </Stack>

      <Row gutter={30} className="dashboard-header">
        <Col xs={6}>
          <Panel className="trend-box bg-gradient-red">
            {/* <img className="chart-img" src={images.PVIcon} /> */}
            <div className="title">Form Leads </div>
            <div className="value">{countData.totalLead}</div>
          </Panel>
        </Col>
         <Col xs={6}>
          <Panel className="trend-box bg-gradient-blue">
            {/* <img className="chart-img" src={images.UVIcon} /> */}
            <div className="title">Conversions</div>
            <div className="value">{countData.totalConversions}</div>
          </Panel>
        </Col>
        <Col xs={6}>
          <Panel className="trend-box bg-gradient-green">
            {/* <img className="chart-img" src={images.VVICon} /> */}
            <div className="title">Users </div>
            <div className="value">--</div>
          </Panel>
        </Col>
        <Col xs={6}>
          <Panel className="trend-box bg-gradient-blue">
            {/* <img className="chart-img" src={images.UVIcon} /> */}
            <div className="title">Queries</div>
            <div className="value">--</div>
          </Panel>
        </Col>
       
      </Row>



      {/* Pie Charts Row */}
      <Row gutter={30}>
        <Col xs={8}>
          <ConversionByPieChart
            data={pieChartData.conversion_by_group}
            loading={pieChartLoading}
          />
        </Col>
        <Col xs={8}>
          <SourceWisePieChart
            data={pieChartData.source_group}
            loading={pieChartLoading}
          />
        </Col>
        <Col xs={8}>
          <PlatformWisePieChart
            data={pieChartData.platform_group}
            loading={pieChartLoading}
          />
        </Col>
      </Row>

      {/* Bar Charts Row */}
      <Row gutter={30} style={{ marginTop: 30 }}>
        <Col xs={12}>
          <Top20VenuesChart
            data={top20Data.venue}
            loading={top20Loading}
          />
        </Col>
        <Col xs={12}>
          <VenueLocalitiesChart
            data={localityData.venueLocalities}
            loading={localityLoading}
          />
        </Col>
      </Row>

      {/* Locality Charts Row */}
      <Row gutter={30} style={{ marginTop: 30 }}>

        <Col xs={12}>
          <Top20VendorsChart
            data={top20Data.vendor}
            loading={top20Loading}
          />
        </Col>
        <Col xs={12}>
          <VendorLocalitiesChart
            data={localityData.vendorLocalities}
            loading={localityLoading}
          />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
