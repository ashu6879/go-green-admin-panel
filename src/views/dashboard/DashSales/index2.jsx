// import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer 
} from 'recharts';
import {
  Store,
  Users,
  Truck,
  ShoppingCart,
  UserCheck,
  UserX,
  Package,
  Wallet,
  Eye,
  Check,
  X,
  Plus,
  Activity
} from 'lucide-react';
import '../../../assets/scss/pages/maindashboard.scss';
import { useState } from 'react';

// Base Data JSON
const dashboardData = {
  stats: {
    totalVendors: 156,
    verifiedVendors: 142,
    unverifiedVendors: 14,
    totalCustomers: 2847,
    totalRiders: 89,
    verifiedRiders: 76,
    unverifiedRiders: 13,
    totalProducts: 1234,
    todayOrders: 67,
    activeOrders: 23,
    totalProfit: 45678,
    totalRevenue: 234567
  },
  
  unverifiedVendors: [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@gmail.com",
      phone: "+91 9876543210",
      businessName: "Kumar Electronics",
      registrationDate: "2024-08-05",
      status: "pending"
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 8765432109",
      businessName: "Sharma Fashion Store",
      registrationDate: "2024-08-04",
      status: "pending"
    },
    {
      id: 3,
      name: "Amit Singh",
      email: "amit.singh@business.com",
      phone: "+91 7654321098",
      businessName: "Singh Auto Parts",
      registrationDate: "2024-08-03",
      status: "pending"
    }
  ],
  
  unverifiedRiders: [
    {
      id: 1,
      name: "Vikash Kumar",
      email: "vikash@email.com",
      phone: "+91 9988776655",
      vehicleType: "Motorcycle",
      vehicleNumber: "CH-01-AB-1234",
      registrationDate: "2024-08-06",
      status: "pending"
    },
    {
      id: 2,
      name: "Suresh Yadav",
      email: "suresh.yadav@gmail.com",
      phone: "+91 8877665544",
      vehicleType: "Bicycle",
      vehicleNumber: "N/A",
      registrationDate: "2024-08-05",
      status: "pending"
    }
  ],
  
  recentActivity: [
    {
      id: 1,
      type: "customer_signup",
      message: "New customer registered: Anita Devi",
      time: "2 minutes ago",
      icon: "👤"
    },
    {
      id: 2,
      type: "vendor_product",
      message: "Kumar Electronics uploaded 5 new products",
      time: "15 minutes ago",
      icon: "📦"
    },
    {
      id: 3,
      type: "rider_delivery",
      message: "Vikash completed delivery #ORD-2024-001",
      time: "1 hour ago",
      icon: "🚚"
    },
    {
      id: 4,
      type: "admin_approval",
      message: "Vendor 'Tech Solutions' approved by admin",
      time: "2 hours ago",
      icon: "✅"
    }
  ],
  
  orders: {
    today: 67,
    completed: 45,
    pending: 18,
    cancelled: 4,
    inProgress: 23
  },
  
  chartData: {
    monthlySignups: [
      { name: 'Jan', Vendors: 12, Riders: 8, Customers: 65 },
      { name: 'Feb', Vendors: 19, Riders: 12, Customers: 89 },
      { name: 'Mar', Vendors: 15, Riders: 10, Customers: 72 },
      { name: 'Apr', Vendors: 25, Riders: 15, Customers: 95 },
      { name: 'May', Vendors: 22, Riders: 14, Customers: 88 },
      { name: 'Jun', Vendors: 18, Riders: 11, Customers: 76 },
      { name: 'Jul', Vendors: 24, Riders: 16, Customers: 102 },
      { name: 'Aug', Vendors: 14, Riders: 13, Customers: 89 }
    ],
    
    orderStatus: [
      { name: 'Completed', value: 45, color: '#1cc88a' },
      { name: 'Pending', value: 18, color: '#f6c23e' },
      { name: 'In Progress', value: 23, color: '#36b9cc' },
      { name: 'Cancelled', value: 4, color: '#e74a3b' }
    ]
  }
};

const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAction = (action, type, item) => {
    setSelectedItem(item);
    setModalType(type);
    setShowModal(true);
  };

  const StatCard = ({ title, value, icon: IconComponent, variant = "primary", subtitle }) => (
    <Card className={`stat-card border-left-${variant} h-100`}>
      <Card.Body>
        <Row className="no-gutters align-items-center">
          <Col className="mr-2">
            <div className={`text-xs font-weight-bold text-${variant} text-uppercase mb-1`}>
              {title}
            </div>
            <div className="h5 mb-0 font-weight-bold text-gray-800">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {subtitle && <div className="text-muted small">{subtitle}</div>}
          </Col>
          <Col xs="auto">
            <div className={`icon-circle bg-${variant}`}>
              <IconComponent size={20} color="white" />
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <div className="admin-dashboard">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Admin Dashboard</h1>
        <div className="btn-group" role="group">
          <Button variant="primary" size="sm">
            <Plus size={16} className="me-1" /> Add Vendor
          </Button>
          <Button variant="success" size="sm">
            <Plus size={16} className="me-1" /> Add Rider
          </Button>
          <Button variant="info" size="sm">
            <Users size={16} className="me-1" /> All Customers
          </Button>
        </div>
      </div>

      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-4">
          <StatCard
            title="Total Vendors"
            value={dashboardData.stats.totalVendors}
            icon={Store}
            variant="primary"
            subtitle={`${dashboardData.stats.unverifiedVendors} pending approval`}
          />
        </Col>
        <Col xl={3} md={6} className="mb-4">
          <StatCard
            title="Total Customers"
            value={dashboardData.stats.totalCustomers}
            icon={Users}
            variant="success"
          />
        </Col>
        <Col xl={3} md={6} className="mb-4">
          <StatCard
            title="Total Riders"
            value={dashboardData.stats.totalRiders}
            icon={Truck}
            variant="info"
            subtitle={`${dashboardData.stats.unverifiedRiders} pending approval`}
          />
        </Col>
        <Col xl={3} md={6} className="mb-4">
          <StatCard
            title="Today's Orders"
            value={dashboardData.stats.todayOrders}
            icon={ShoppingCart}
            variant="warning"
            subtitle={`${dashboardData.stats.activeOrders} active`}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-4">
          <StatCard
            title="New Vendor Requests"
            value={dashboardData.stats.unverifiedVendors}
            icon={UserX}
            variant="danger"
          />
        </Col>
        <Col xl={3} md={6} className="mb-4">
          <StatCard
            title="New Rider Requests"
            value={dashboardData.stats.unverifiedRiders}
            icon={UserX}
            variant="danger"
          />
        </Col>
        <Col xl={3} md={6} className="mb-4">
          <StatCard
            title="Total Products"
            value={dashboardData.stats.totalProducts}
            icon={Package}
            variant="secondary"
          />
        </Col>
        <Col xl={3} md={6} className="mb-4">
          <StatCard
            title="Total Revenue"
            value={`₹${dashboardData.stats.totalRevenue.toLocaleString()}`}
            icon={Wallet}
            variant="success"
          />
        </Col>
      </Row>

      {/* Unverified Requests Section */}
      <Row className="mb-4">
        <Col lg={6}>
          <Card className="shadow mb-4">
            <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Pending Vendor Approvals</h6>
              <Badge variant="danger">{dashboardData.unverifiedVendors.length}</Badge>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table className="table-borderless" size="sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Business</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.unverifiedVendors.map(vendor => (
                      <tr key={vendor.id}>
                        <td>
                          <div className="font-weight-bold">{vendor.name}</div>
                          <div className="text-muted small">{vendor.email}</div>
                        </td>
                        <td>{vendor.businessName}</td>
                        <td>{new Date(vendor.registrationDate).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="success"
                            size="sm"
                            className="mr-1"
                            onClick={() => handleAction('approve', 'vendor', vendor)}
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="mr-1"
                            onClick={() => handleAction('reject', 'vendor', vendor)}
                          >
                            <X size={14} />
                          </Button>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleAction('view', 'vendor', vendor)}
                          >
                            <Eye size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow mb-4">
            <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Pending Rider Approvals</h6>
              <Badge variant="danger">{dashboardData.unverifiedRiders.length}</Badge>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table className="table-borderless" size="sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Vehicle</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.unverifiedRiders.map(rider => (
                      <tr key={rider.id}>
                        <td>
                          <div className="font-weight-bold">{rider.name}</div>
                          <div className="text-muted small">{rider.email}</div>
                        </td>
                        <td>
                          <div>{rider.vehicleType}</div>
                          <div className="text-muted small">{rider.vehicleNumber}</div>
                        </td>
                        <td>{new Date(rider.registrationDate).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="success"
                            size="sm"
                            className="mr-1"
                            onClick={() => handleAction('approve', 'rider', rider)}
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="mr-1"
                            onClick={() => handleAction('reject', 'rider', rider)}
                          >
                            <X size={14} />
                          </Button>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleAction('view', 'rider', rider)}
                          >
                            <Eye size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts and Activity Section */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow mb-4">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">Monthly Sign-ups Overview</h6>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.chartData.monthlySignups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Vendors" fill="#4e73df" />
                  <Bar dataKey="Riders" fill="#e74a3b" />
                  <Bar dataKey="Customers" fill="#1cc88a" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow mb-4">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">Recent Activity</h6>
            </Card.Header>
            <Card.Body className="activity-feed">
              {dashboardData.recentActivity.map(activity => (
                <div key={activity.id} className="activity-item d-flex align-items-start mb-3">
                  <div className="activity-icon mr-3">
                    <div className="icon-circle bg-light">
                      <Activity size={16} color="#5a5c69" />
                    </div>
                  </div>
                  <div className="activity-content">
                    <div className="font-weight-bold">{activity.message}</div>
                    <div className="text-muted small">{activity.time}</div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Orders Overview and Pie Chart */}
      <Row className="mb-4">
        <Col lg={6}>
          <Card className="shadow mb-4">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">Orders Overview</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={6} className="mb-3">
                  <div className="order-stat">
                    <h4 className="text-success mb-0">{dashboardData.orders.completed}</h4>
                    <div className="text-muted">Completed Orders</div>
                  </div>
                </Col>
                <Col sm={6} className="mb-3">
                  <div className="order-stat">
                    <h4 className="text-warning mb-0">{dashboardData.orders.pending}</h4>
                    <div className="text-muted">Pending Orders</div>
                  </div>
                </Col>
                <Col sm={6} className="mb-3">
                  <div className="order-stat">
                    <h4 className="text-info mb-0">{dashboardData.orders.inProgress}</h4>
                    <div className="text-muted">In Progress</div>
                  </div>
                </Col>
                <Col sm={6} className="mb-3">
                  <div className="order-stat">
                    <h4 className="text-danger mb-0">{dashboardData.orders.cancelled}</h4>
                    <div className="text-muted">Cancelled Orders</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow mb-4">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">Order Status Distribution</h6>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.chartData.orderStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.chartData.orderStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'vendor' ? 'Vendor' : 'Rider'} Action
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div>
              <h6>Details:</h6>
              <p><strong>Name:</strong> {selectedItem.name}</p>
              <p><strong>Email:</strong> {selectedItem.email}</p>
              <p><strong>Phone:</strong> {selectedItem.phone}</p>
              {modalType === 'vendor' && (
                <p><strong>Business:</strong> {selectedItem.businessName}</p>
              )}
              {modalType === 'rider' && (
                <>
                  <p><strong>Vehicle:</strong> {selectedItem.vehicleType}</p>
                  <p><strong>Vehicle Number:</strong> {selectedItem.vehicleNumber}</p>
                </>
              )}
              <p><strong>Registration Date:</strong> {selectedItem.registrationDate}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success">
            <Check size={16} className="me-1" /> Approve
          </Button>
          <Button variant="danger">
            <X size={16} className="me-1" /> Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;