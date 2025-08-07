

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Badge, Button, Statistic, Table, Progress, Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  User,
  Package,
  Phone,
  Mail,
  MapPin,
  FileText,
  Banknote,
  TrendingUp,
  TrendingDown,
  Star,
  Eye,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock
} from 'lucide-react';
import { BarChart as LucideBarChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { getRiderById } from '../../../services/apiService';

const { TabPane } = Tabs;

const RiderDashboard = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [analyticsView, setAnalyticsView] = useState('daily');
  const [riderData, setRiderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { riderId } = useParams();

  useEffect(() => {
    async function fetchRider() {
      setLoading(true);
      const id = riderId || window.location.pathname.split('/').pop();
      const res = await getRiderById(id);
      if (res && res.data) {
        setRiderData(res.data);
      } else {
        message.error(res?.message || 'Failed to fetch rider details');
      }
      setLoading(false);
    }
    fetchRider();
  }, [riderId]);

  // Fallback for static if API fails - using rider-specific fields only
  const riderInfo = riderData || {
    custom_id: "RID20250716114043NAJ",
    role_id: 4,
    username: "rider_demo",
    is_verified: 1,
    verification_applied: 1,
    status: 1,
    firstname: "Demo",
    lastname: "Rider",
    email: "rider@example.com",
    prefix: "+91",
    phonenumber: "9999999999",
    identity_proof: null,
    license_number: "DL1234567890",
    profile_pic: null,
    rider_lat: "28.6139",
    rider_lng: "77.2090",
    rider_id: riderId || 0,
    vehicle_registration_number: "DL01AB1234"
  };

  // Sample rider analytics data - focused on deliveries, not sales
  const analyticsData = {
    daily: [
      { period: '2025-07-12', earnings: 450, orders: 18, rejected: 2, rating: 4.8 },
      { period: '2025-07-13', earnings: 620, orders: 25, rejected: 1, rating: 4.9 },
      { period: '2025-07-14', earnings: 780, orders: 31, rejected: 3, rating: 4.7 },
      { period: '2025-07-15', earnings: 500, orders: 20, rejected: 1, rating: 4.8 },
      { period: '2025-07-16', earnings: 850, orders: 35, rejected: 2, rating: 4.9 },
      { period: '2025-07-17', earnings: 680, orders: 28, rejected: 1, rating: 4.8 },
      { period: '2025-07-18', earnings: 920, orders: 38, rejected: 2, rating: 4.9 }
    ],
    weekly: [
      { period: 'Week 1', earnings: 2950, orders: 142, rejected: 8, rating: 4.8 },
      { period: 'Week 2', earnings: 3800, orders: 186, rejected: 12, rating: 4.7 },
      { period: 'Week 3', earnings: 4200, orders: 225, rejected: 15, rating: 4.8 },
      { period: 'Week 4', earnings: 4750, orders: 267, rejected: 18, rating: 4.9 },
      { period: 'Week 5', earnings: 5100, orders: 298, rejected: 20, rating: 4.8 },
      { period: 'Week 6', earnings: 4800, orders: 278, rejected: 16, rating: 4.7 }
    ],
    monthly: [
      { period: 'Jan', earnings: 15200, orders: 650, rejected: 45, rating: 4.8 },
      { period: 'Feb', earnings: 18800, orders: 720, rejected: 52, rating: 4.7 },
      { period: 'Mar', earnings: 16900, orders: 695, rejected: 48, rating: 4.8 },
      { period: 'Apr', earnings: 19700, orders: 785, rejected: 55, rating: 4.9 },
      { period: 'May', earnings: 21400, orders: 865, rejected: 62, rating: 4.8 },
      { period: 'Jun', earnings: 19900, orders: 825, rejected: 58, rating: 4.7 },
      { period: 'Jul', earnings: 22200, orders: 892, rejected: 65, rating: 4.9 }
    ],
    quarterly: [
      { period: 'Q1 2024', earnings: 50900, orders: 2065, rejected: 145, rating: 4.8 },
      { period: 'Q2 2024', earnings: 61000, orders: 2475, rejected: 175, rating: 4.7 },
      { period: 'Q3 2024', earnings: 65400, orders: 2698, rejected: 185, rating: 4.8 },
      { period: 'Q4 2024', earnings: 68800, orders: 2856, rejected: 195, rating: 4.9 },
      { period: 'Q1 2025', earnings: 63100, orders: 2582, rejected: 178, rating: 4.8 }
    ]
  };

  const deliveryTypeData = [
    { name: 'Food Delivery', value: 45, color: '#1890ff' },
    { name: 'Grocery', value: 30, color: '#52c41a' },
    { name: 'Pharmacy', value: 15, color: '#faad14' },
    { name: 'Electronics', value: 7, color: '#f5222d' },
    { name: 'Others', value: 3, color: '#722ed1' }
  ];

  const getCurrentData = () => analyticsData[analyticsView];

  const getTotalEarnings = () => {
    return getCurrentData().reduce((sum, item) => sum + item.earnings, 0);
  };

  const getTotalOrders = () => {
    return getCurrentData().reduce((sum, item) => sum + item.orders, 0);
  };

  const getTotalRejected = () => {
    return getCurrentData().reduce((sum, item) => sum + item.rejected, 0);
  };

  const getAverageRating = () => {
    const data = getCurrentData();
    const totalRating = data.reduce((sum, item) => sum + item.rating, 0);
    return (totalRating / data.length).toFixed(1);
  };

  // Document status data
  const documentColumns = [
    {
      title: 'Document Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'Uploaded' ? 'success' : 'warning'} 
          text={status}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small">
          {record.status === 'Uploaded' ? 'View' : 'Upload'}
        </Button>
      ),
    },
  ];

  const documentData = [
    { key: '1', name: 'Identity Proof', status: riderInfo.identity_proof ? 'Uploaded' : 'Pending' },
    { key: '2', name: 'Driving License', status: riderInfo.license_number ? 'Uploaded' : 'Pending' },
    { key: '3', name: 'Vehicle Registration', status: riderInfo.vehicle_registration_number ? 'Uploaded' : 'Pending' },
    { key: '4', name: 'Profile Picture', status: riderInfo.profile_pic ? 'Uploaded' : 'Pending' }
  ];

  const StatCard = ({ title, value, icon, trend, trendValue, color = "#1890ff", suffix = "" }) => (
    <Card className="mb-3" style={{ borderLeft: `4px solid ${color}` }}>
      <Statistic
        title={title}
        value={value}
        suffix={suffix}
        prefix={icon}
        valueStyle={{ color: color }}
      />
      {trend && (
        <div className="mt-2">
          <span style={{ color: trend === 'up' ? '#52c41a' : '#f5222d' }}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {' '}{trendValue}
          </span>
        </div>
      )}
    </Card>
  );

  const InfoRow = ({ icon, label, value }) => (
    <div className="d-flex align-items-center mb-3">
      <div className="me-3" style={{ color: '#1890ff' }}>
        {icon}
      </div>
      <div>
        <div className="fw-bold">{value}</div>
        <small className="text-muted">{label}</small>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card className="mb-4" style={{ borderRadius: '0' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <div className="d-flex align-items-center">
              <div 
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#1890ff',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
              >
                {riderInfo.profile_pic ? (
                  <img 
                    src={riderInfo.profile_pic} 
                    alt="Profile" 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                ) : (
                  <span>{riderInfo.firstname?.[0]?.toUpperCase()}{riderInfo.lastname?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <h3 className="mb-1">{riderInfo.firstname} {riderInfo.lastname}</h3>
                <p className="text-muted mb-0">Rider ID: {riderInfo.custom_id}</p>
              </div>
            </div>
          </Col>
          <Col>
            <Badge 
              status={riderInfo.is_verified === 1 ? 'success' : 'warning'}
              text={riderInfo.is_verified === 1 ? 'Verified' : 'Pending Verification'}
            />
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <div className="container-fluid">
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          {/* Overview Tab */}
          <TabPane tab={<span><Eye size={16} /> Overview</span>} key="1">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Total Earnings"
                  value={getTotalEarnings().toLocaleString()}
                  icon={<DollarSign size={16} />}
                  trend="up"
                  trendValue="12.5%"
                  color="#52c41a"
                  suffix="$"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Total Orders"
                  value={getTotalOrders().toLocaleString()}
                  icon={<ShoppingCart size={16} />}
                  trend="up"
                  trendValue="8.2%"
                  color="#1890ff"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Rejected Orders"
                  value={getTotalRejected()}
                  icon={<Package size={16} />}
                  trend="down"
                  trendValue="2.1%"
                  color="#f5222d"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Average Rating"
                  value={getAverageRating()}
                  icon={<Star size={16} />}
                  trend="up"
                  trendValue="0.1"
                  color="#faad14"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24} lg={12}>
                <Card title="Daily Earnings Trend" className="h-100">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.daily}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="earnings" stroke="#1890ff" fill="#1890ff" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Deliveries by Type" className="h-100">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deliveryTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deliveryTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Rider Details Tab */}
          <TabPane tab={<span><User size={16} /> Rider Details</span>} key="2">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Personal Information" className="h-100">
                  <InfoRow 
                    icon={<User size={16} />}
                    label="Full Name"
                    value={`${riderInfo.firstname} ${riderInfo.lastname}`}
                  />
                  <InfoRow 
                    icon={<Mail size={16} />}
                    label="Email Address"
                    value={riderInfo.email}
                  />
                  <InfoRow 
                    icon={<Phone size={16} />}
                    label="Phone Number"
                    value={`${riderInfo.prefix} ${riderInfo.phonenumber}`}
                  />
                  <InfoRow 
                    icon={<MapPin size={16} />}
                    label="Current Location"
                    value={riderInfo.rider_lat && riderInfo.rider_lng ? `${riderInfo.rider_lat}, ${riderInfo.rider_lng}` : 'Not Available'}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Rider Information" className="h-100">
                  <InfoRow 
                    icon={<FileText size={16} />}
                    label="License Number"
                    value={riderInfo.license_number || 'Not Provided'}
                  />
                  <InfoRow 
                    icon={<Package size={16} />}
                    label="Vehicle Registration"
                    value={riderInfo.vehicle_registration_number || 'Not Provided'}
                  />
                  <InfoRow 
                    icon={<User size={16} />}
                    label="Username"
                    value={riderInfo.username}
                  />
                  <InfoRow 
                    icon={<Calendar size={16} />}
                    label="Rider ID"
                    value={riderInfo.rider_id}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Vehicle Details Tab */}
          <TabPane tab={<span><Package size={16} /> Vehicle Details</span>} key="3">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Vehicle Information">
                  <InfoRow 
                    icon={<Package size={16} />}
                    label="Registration Number"
                    value={riderInfo.vehicle_registration_number || 'Not Provided'}
                  />
                  <InfoRow 
                    icon={<FileText size={16} />}
                    label="License Number"
                    value={riderInfo.license_number || 'Not Provided'}
                  />
                  <InfoRow 
                    icon={<MapPin size={16} />}
                    label="Current Location"
                    value={riderInfo.rider_lat && riderInfo.rider_lng ? `Lat: ${riderInfo.rider_lat}, Lng: ${riderInfo.rider_lng}` : 'Not Available'}
                  />
                  <InfoRow 
                    icon={<User size={16} />}
                    label="Rider Status"
                    value={riderInfo.status === 1 ? 'Active' : 'Inactive'}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Rider Documents">
                  <Table 
                    columns={documentColumns} 
                    dataSource={documentData} 
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Bank Details Tab */}
          <TabPane tab={<span><Banknote size={16} /> Bank Details</span>} key="4">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Bank Account Information">
                  <InfoRow 
                    icon={<Banknote size={16} />}
                    label="Account Number"
                    value="****-****-****-1234"
                  />
                  <InfoRow 
                    icon={<User size={16} />}
                    label="Account Holder"
                    value={`${riderInfo.firstname} ${riderInfo.lastname}`}
                  />
                  <InfoRow 
                    icon={<Banknote size={16} />}
                    label="Bank Name"
                    value="Sample Bank Ltd."
                  />
                  <InfoRow 
                    icon={<FileText size={16} />}
                    label="IFSC Code"
                    value="SAMP0001234"
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Payment Settings">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-bold">Auto Payout</span>
                      <Badge status="success" text="Enabled" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-bold">Payout Schedule</span>
                      <span>Weekly</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-bold">Next Payout</span>
                      <span>July 25, 2025</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Analytics Tab */}
          <TabPane tab={<span><LucideBarChart size={16} /> Analytics</span>} key="5">
            <Row gutter={[16, 16]} className="mb-4">
              <Col xs={24}>
                <Card>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Analytics Dashboard</h4>
                    <div className="btn-group">
                      {['daily', 'weekly', 'monthly', 'quarterly'].map((view) => (
                        <Button
                          key={view}
                          type={analyticsView === view ? 'primary' : 'default'}
                          onClick={() => setAnalyticsView(view)}
                          size="small"
                        >
                          {view.charAt(0).toUpperCase() + view.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <StatCard
                  title="Total Earnings"
                  value={getTotalEarnings().toLocaleString()}
                  icon={<DollarSign size={16} />}
                  trend="up"
                  trendValue="15.2%"
                  color="#52c41a"
                  suffix="$"
                />
              </Col>
              <Col xs={24} md={8}>
                <StatCard
                  title="Total Orders"
                  value={getTotalOrders().toLocaleString()}
                  icon={<ShoppingCart size={16} />}
                  trend="up"
                  trendValue="8.7%"
                  color="#1890ff"
                />
              </Col>
              <Col xs={24} md={8}>
                <StatCard
                  title="Average Rating"
                  value={getAverageRating()}
                  icon={<Star size={16} />}
                  trend="up"
                  trendValue="0.1"
                  color="#722ed1"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24} lg={12}>
                <Card title="Earnings Trend" className="h-100">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={getCurrentData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="earnings" stroke="#52c41a" fill="#52c41a" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Orders & Rejections" className="h-100">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={getCurrentData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#1890ff" name="Completed Orders" />
                      <Bar dataKey="rejected" fill="#f5222d" name="Rejected Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default RiderDashboard;