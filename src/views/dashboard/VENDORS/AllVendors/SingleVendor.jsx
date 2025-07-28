// // react-bootstrap
// import { Row, Col, Card } from 'react-bootstrap';

// // third party
// import Chart from 'react-apexcharts';

// // project imports
// import FlatCard from 'components/Widgets/Statistic/FlatCard';
// import ProductCard from 'components/Widgets/Statistic/ProductCard';
// import FeedTable from 'components/Widgets/FeedTable';
// import ProductTable from 'components/Widgets/ProductTable';
// import { SalesCustomerSatisfactionChartData } from '../../DashSales/chart/sales-customer-satisfication-chart';
// import { SalesAccountChartData } from '../../DashSales/chart/sales-account-chart';
// import { SalesSupportChartData } from '../../DashSales/chart/sales-support-chart';

// import feedData from 'data/feedData';
// import productData from 'data/productTableData';
// import { SalesSupportChartData1 } from '../../DashSales/chart/sales-support-chart1';

// // -----------------------|| DASHBOARD SALES ||-----------------------//
// export default function SingleVendor() {
//   return (
//     <Row className='p2'>
//       <Col md={12} xl={6}>
//         <Card className="flat-card">
//           <div className="row-table">
//             <Card.Body className="col-sm-6 br">
//               <FlatCard params={{ title: 'Customers', iconClass: 'text-primary mb-1', icon: 'group', value: '1000' }} />
//             </Card.Body>
//             <Card.Body className="col-sm-6 d-none d-md-table-cell d-lg-table-cell d-xl-table-cell card-body br">
//               <FlatCard params={{ title: 'Revenue', iconClass: 'text-primary mb-1', icon: 'language', value: '1252' }} />
//             </Card.Body>
//             <Card.Body className="col-sm-6 card-bod">
//               <FlatCard params={{ title: 'Growth', iconClass: 'text-primary mb-1', icon: 'unarchive', value: '600' }} />
//             </Card.Body>
//           </div>
//           <div className="row-table">
//             <Card.Body className="col-sm-6 br">
//               <FlatCard
//                 params={{
//                   title: 'Returns',
//                   iconClass: 'text-primary mb-1',
//                   icon: 'swap_horizontal_circle',
//                   value: '3550'
//                 }}
//               />
//             </Card.Body>
//             <Card.Body className="col-sm-6 d-none d-md-table-cell d-lg-table-cell d-xl-table-cell card-body br">
//               <FlatCard params={{ title: 'Downloads', iconClass: 'text-primary mb-1', icon: 'cloud_download', value: '3550' }} />
//             </Card.Body>
//             <Card.Body className="col-sm-6 card-bod">
//               <FlatCard params={{ title: 'Order', iconClass: 'text-primary mb-1', icon: 'shopping_cart', value: '100%' }} />
//             </Card.Body>
//           </div>
//         </Card>
//         <Row>
//           <Col md={6}>
//             <Card className="support-bar overflow-hidden">
//               <Card.Body className="pb-0">
//                 <h2 className="m-0">53.94%</h2>
//                 <span className="text-primary">Conversion Rate</span>
//                 <p className="mb-3 mt-3">Number of conversions divided by the total visitors. </p>
//               </Card.Body>
//               <Chart {...SalesSupportChartData()} />
//               <Card.Footer className="border-0 bg-primary text-white background-pattern-white">
//                 <Row className="text-center">
//                   <Col>
//                     <h4 className="m-0 text-white">10</h4>
//                     <span>2018</span>
//                   </Col>
//                   <Col>
//                     <h4 className="m-0 text-white">15</h4>
//                     <span>2017</span>
//                   </Col>
//                   <Col>
//                     <h4 className="m-0 text-white">13</h4>
//                     <span>2016</span>
//                   </Col>
//                 </Row>
//               </Card.Footer>
//             </Card>
//           </Col>
//           <Col md={6}>
//             <Card className="support-bar overflow-hidden">
//               <Card.Body className="pb-0">
//                 <h2 className="m-0">1432</h2>
//                 <span className="text-primary">Order Delivered</span>
//                 <p className="mb-3 mt-3">Number of conversions divided by the total visitors. </p>
//               </Card.Body>
//               <Card.Footer className="border-0">
//                 <Row className="text-center">
//                   <Col>
//                     <h4 className="m-0">130</h4>
//                     <span>May</span>
//                   </Col>
//                   <Col>
//                     <h4 className="m-0">251</h4>
//                     <span>June</span>
//                   </Col>
//                   <Col>
//                     <h4 className="m-0 ">235</h4>
//                     <span>July</span>
//                   </Col>
//                 </Row>
//               </Card.Footer>
//               <Chart type="bar" {...SalesSupportChartData1()} />
//             </Card>
//           </Col>
//         </Row>
//       </Col>
//       <Col md={12} xl={6}>
//         <Card>
//           <Card.Header>
//             <h5>Department wise monthly sales report</h5>
//           </Card.Header>
//           <Card.Body>
//             <Row className="pb-2">
//               <div className="col-auto m-b-10">
//                 <h3 className="mb-1">$21,356.46</h3>
//                 <span>Total Sales</span>
//               </div>
//               <div className="col-auto m-b-10">
//                 <h3 className="mb-1">$1935.6</h3>
//                 <span>Average</span>
//               </div>
//             </Row>
//             <Chart {...SalesAccountChartData()} />
//           </Card.Body>
//         </Card>
//       </Col>
//       <Col md={12} xl={6}>
//         <Card>
//           <Card.Body>
//             <h6>Customer Satisfaction</h6>
//             <span>It takes continuous effort to maintain high customer satisfaction levels Internal and external.</span>
//             <Row className="d-flex justify-content-center align-items-center">
//               <Col>
//                 <Chart type="pie" {...SalesCustomerSatisfactionChartData()} />
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>
//         {/* Product Table */}
//         <ProductTable {...productData} />
//       </Col>
//       <Col md={12} xl={6}>
//         <Row>
//           <Col sm={6}>
//             <ProductCard params={{ title: 'Total Profit', primaryText: '$1,783', icon: 'card_giftcard' }} />
//           </Col>
//           <Col sm={6}>
//             <ProductCard params={{ variant: 'primary', title: 'Total Orders', primaryText: '15,830', icon: 'local_mall' }} />
//           </Col>
//           <Col sm={6}>
//             <ProductCard params={{ variant: 'primary', title: 'Average Price', primaryText: '$6,780', icon: 'monetization_on' }} />
//           </Col>
//           <Col sm={6}>
//             <ProductCard params={{ title: 'Product Sold', primaryText: '6,784', icon: 'local_offer' }} />
//           </Col>
//         </Row>
//         {/* Feed Table */}
//         <FeedTable {...feedData} />
//       </Col>
//     </Row>
//   );
// }







import React, { useState } from 'react';
import { Row, Col, Card, Tabs, Badge, Button, Statistic, Table, Progress } from 'antd';
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

const { TabPane } = Tabs;

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [analyticsView, setAnalyticsView] = useState('daily');

  // Vendor data
  const vendorData = {
    custom_id: "VEN20250716114043NAJ",
    role_id: 3,
    username: "ddz685",
    is_verified: 3,
    verification_applied: 1,
    status: null,
    firstname: "deepti",
    lastname: "verma",
    email: "deepti26@gmail.com",
    prefix: "+1",
    phonenumber: "8529069102",
    country_status: "1234",
    business_reg_number: "1234",
    store_image: null,
    identity_proof: null,
    vendor_thumb: null,
    vendor_timing: null,
    vendor_lat: null,
    vendor_lng: null,
    bussiness_license_number: null,
    bussiness_license_number_pic: null,
    gst_number: "GST123456789",
    gst_number_pic: null,
    vendor_insurance_certificate: null,
    health_inspection_certificate: null,
    food_certificate: null,
    store_address: "3706 hill road",
    sin_code: "1234",
    store_name: "first vendor store",
    profile_pic: null,
    vendor_id: 5
  };

  // Sample analytics data
  const analyticsData = {
    daily: [
      { period: '2025-07-12', earnings: 1250, orders: 18, customers: 15 },
      { period: '2025-07-13', earnings: 1890, orders: 25, customers: 22 },
      { period: '2025-07-14', earnings: 2100, orders: 31, customers: 28 },
      { period: '2025-07-15', earnings: 1650, orders: 20, customers: 18 },
      { period: '2025-07-16', earnings: 2350, orders: 35, customers: 32 },
      { period: '2025-07-17', earnings: 1980, orders: 28, customers: 25 },
      { period: '2025-07-18', earnings: 2450, orders: 38, customers: 35 }
    ],
    weekly: [
      { period: 'Week 1', earnings: 8950, orders: 142, customers: 128 },
      { period: 'Week 2', earnings: 12400, orders: 186, customers: 165 },
      { period: 'Week 3', earnings: 15200, orders: 225, customers: 198 },
      { period: 'Week 4', earnings: 18750, orders: 267, customers: 235 },
      { period: 'Week 5', earnings: 21300, orders: 298, customers: 268 },
      { period: 'Week 6', earnings: 19800, orders: 278, customers: 245 }
    ],
    monthly: [
      { period: 'Jan', earnings: 45200, orders: 650, customers: 580 },
      { period: 'Feb', earnings: 52800, orders: 720, customers: 645 },
      { period: 'Mar', earnings: 48900, orders: 695, customers: 612 },
      { period: 'Apr', earnings: 56700, orders: 785, customers: 698 },
      { period: 'May', earnings: 62400, orders: 865, customers: 756 },
      { period: 'Jun', earnings: 58900, orders: 825, customers: 724 },
      { period: 'Jul', earnings: 65200, orders: 892, customers: 798 }
    ],
    quarterly: [
      { period: 'Q1 2024', earnings: 146900, orders: 2065, customers: 1837 },
      { period: 'Q2 2024', earnings: 178000, orders: 2475, customers: 2178 },
      { period: 'Q3 2024', earnings: 195400, orders: 2698, customers: 2385 },
      { period: 'Q4 2024', earnings: 212800, orders: 2856, customers: 2534 },
      { period: 'Q1 2025', earnings: 189100, orders: 2582, customers: 2298 }
    ]
  };

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#1890ff' },
    { name: 'Clothing', value: 25, color: '#52c41a' },
    { name: 'Home & Garden', value: 20, color: '#faad14' },
    { name: 'Books', value: 12, color: '#f5222d' },
    { name: 'Sports', value: 8, color: '#722ed1' }
  ];

  const getCurrentData = () => analyticsData[analyticsView];

  const getTotalEarnings = () => {
    return getCurrentData().reduce((sum, item) => sum + item.earnings, 0);
  };

  const getTotalOrders = () => {
    return getCurrentData().reduce((sum, item) => sum + item.orders, 0);
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
    { key: '1', name: 'Business License', status: vendorData.bussiness_license_number ? 'Uploaded' : 'Pending' },
    { key: '2', name: 'GST Certificate', status: vendorData.gst_number_pic ? 'Uploaded' : 'Pending' },
    { key: '3', name: 'Identity Proof', status: vendorData.identity_proof ? 'Uploaded' : 'Pending' },
    { key: '4', name: 'Insurance Certificate', status: vendorData.vendor_insurance_certificate ? 'Uploaded' : 'Pending' },
    { key: '5', name: 'Health Certificate', status: vendorData.health_inspection_certificate ? 'Uploaded' : 'Pending' }
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
                {vendorData.firstname[0].toUpperCase()}{vendorData.lastname[0].toUpperCase()}
              </div>
              <div>
                <h3 className="mb-1">{vendorData.store_name}</h3>
                <p className="text-muted mb-0">ID: {vendorData.custom_id}</p>
              </div>
            </div>
          </Col>
          <Col>
            <Badge 
              status={vendorData.is_verified === 3 ? 'success' : 'warning'}
              text={vendorData.is_verified === 3 ? 'Verified' : 'Pending Verification'}
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
                  title="Active Products"
                  value={142}
                  icon={<Package size={16} />}
                  trend="up"
                  trendValue="3.1%"
                  color="#722ed1"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Customer Rating"
                  value={4.8}
                  icon={<Star size={16} />}
                  trend="up"
                  trendValue="0.3"
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
                <Card title="Sales by Category" className="h-100">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
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

          {/* Owner Details Tab */}
          <TabPane tab={<span><User size={16} /> Owner Details</span>} key="2">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Personal Information" className="h-100">
                  <InfoRow 
                    icon={<User size={16} />}
                    label="Full Name"
                    value={`${vendorData.firstname} ${vendorData.lastname}`}
                  />
                  <InfoRow 
                    icon={<Mail size={16} />}
                    label="Email Address"
                    value={vendorData.email}
                  />
                  <InfoRow 
                    icon={<Phone size={16} />}
                    label="Phone Number"
                    value={`${vendorData.prefix} ${vendorData.phonenumber}`}
                  />
                  <InfoRow 
                    icon={<MapPin size={16} />}
                    label="Address"
                    value={vendorData.store_address}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Store Information" className="h-100">
                  <InfoRow 
                    icon={<Package size={16} />}
                    label="Store Name"
                    value={vendorData.store_name}
                  />
                  <InfoRow 
                    icon={<FileText size={16} />}
                    label="Business Registration"
                    value={vendorData.business_reg_number}
                  />
                  <InfoRow 
                    icon={<FileText size={16} />}
                    label="GST Number"
                    value={vendorData.gst_number || 'Not Provided'}
                  />
                  <InfoRow 
                    icon={<Calendar size={16} />}
                    label="Vendor ID"
                    value={vendorData.vendor_id}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Store Details Tab */}
          <TabPane tab={<span><Package size={16} /> Store Details</span>} key="3">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Store Information">
                  <InfoRow 
                    icon={<Package size={16} />}
                    label="Vendor ID"
                    value={vendorData.vendor_id}
                  />
                  <InfoRow 
                    icon={<Package size={16} />}
                    label="Shop Name"
                    value={vendorData.store_name}
                  />
                  <InfoRow 
                    icon={<MapPin size={16} />}
                    label="Address"
                    value={vendorData.store_address}
                  />
                  <InfoRow 
                    icon={<FileText size={16} />}
                    label="GST Number"
                    value={vendorData.gst_number || 'Not Provided'}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="All Documents">
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
                    value={`${vendorData.firstname} ${vendorData.lastname}`}
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
                  title="Avg Order Value"
                  value={(getTotalEarnings() / getTotalOrders()).toFixed(2)}
                  icon={<TrendingUp size={16} />}
                  trend="up"
                  trendValue="6.3%"
                  color="#722ed1"
                  suffix="$"
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
                <Card title="Orders & Customers" className="h-100">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={getCurrentData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#1890ff" />
                      <Bar dataKey="customers" fill="#722ed1" />
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

export default VendorDashboard;