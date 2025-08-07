import React, { useState } from "react";
import  "/src/assets/scss/pages/usermodal.scss";
import { Spin, Badge, Tag, Image } from "antd";
import { 
  User, 
  FileText, 
  Phone, 
  Mail, 
  Calendar, 
  Building, 
  Store, 
  MapPin, 
  CreditCard, 
  Receipt, 
  Image as ImageIcon, 
  Shield, 
  Bike, 
  Flag, 
  FileImage 
} from "lucide-react";
import { formatPhone } from "../../../services/utils/gen_utility";

const UserPreview = ({ user, userType, loading }) => {
  if (!user) return null;

  const InfoCard = ({ icon: IconComponent, label, value, className = "" }) => (
    <div className={`info-card ${className}`}>
      <div className="info-card-content">
        <div className="info-icon">
          <IconComponent size={16} />
        </div>
        <div className="info-text">
          <div className="info-label">{label}</div>
          <div className="info-value">{value || '-'}</div>
        </div>
      </div>
    </div>
  );



  return (
    <>
    

      <Spin spinning={loading}>
        <div className="user-preview-container">
          {/* Header Section */}
          <div className="header-section">
            <div className="profile-header">
              <div className="profile-avatar">
                {user.profile_pic ? (
                  <Image
                    src={user.profile_pic}
                    alt="Profile Picture"
                    className="avatar-image"
                    preview={{
                      mask: 'Click to preview'
                    }}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {user.firstname?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="online-indicator"></div>
              </div>
              
              <div className="profile-info">
                <h2>{user.firstname} {user.lastname}</h2>
                <div className="profile-meta">
                  <Shield size={16} />
                  <Tag 
                    color={userType === 'vendors' ? 'blue' : 'green'}
                    style={{ margin: 0 }}
                  >
                    {userType === 'vendors' ? 'Vendor' : 'Rider'}
                  </Tag>
                </div>
                <div className="profile-location">
                  <MapPin size={16} />
                  <span>{user.address || user.store_address || 'Location not provided'}</span>
                </div>
              </div>
            </div>
          </div>

        

          {/* Content */}
          <div className="content-section">
            {/* Basic Information */}
            <div className="section-divider">
              <h4 className="section-header">
                <User size={20} />
                Basic Information
              </h4>
              <div className="info-grid">
                <InfoCard
                  icon={User}
                  label="Username"
                  value={user.username}
                />
                {user.custom_id && (
                  <InfoCard
                    icon={FileText}
                    label="Custom ID"
                    value={user.custom_id}
                  />
                )}
                <InfoCard
                  icon={Phone}
                  label="Phone Number"
                  value={formatPhone(user.phonenumber, user.prefix)}
                />
                <InfoCard
                  icon={Mail}
                  label="Email Address"
                  value={user.email}
                />
                <InfoCard
                  icon={Calendar}
                  label="Joined Date"
                  value={user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : '-'}
                />
              </div>
            </div>

            {/* Type Specific Information */}
            {userType === 'vendors' ? (
              <>
                {/* Business Information */}
                <div className="section-divider">
                  <h4 className="section-header">
                    <Building size={20} />
                    Business Information
                  </h4>
                  <div className="info-grid">
                    <InfoCard
                      icon={Store}
                      label="Store Name"
                      value={user.store_name}
                    />
                    <InfoCard
                      icon={MapPin}
                      label="Store Address"
                      value={user.store_address}
                    />
                    <InfoCard
                      icon={FileText}
                      label="SIN Code"
                      value={user.sin_code}
                    />
                    <InfoCard
                      icon={CreditCard}
                      label="Business Registration"
                      value={user.business_reg_number}
                    />
                    {user.bussiness_license_number && (
                      <InfoCard
                        icon={FileText}
                        label="Business License"
                        value={user.bussiness_license_number}
                      />
                    )}
                    {user.gst_number && (
                      <InfoCard
                        icon={Receipt}
                        label="GST Number"
                        value={user.gst_number}
                      />
                    )}
                  </div>
                </div>

                {/* Documents & Images */}
                <div className="section-divider">
                  <h4 className="section-header">
                    <ImageIcon size={20} />
                    Documents & Images
                  </h4>
                  
                  <Image.PreviewGroup>
                    <div className="image-grid">
                      {user.store_image && (
                        <Image src={user.store_image} alt="Store Image" />
                      )}
                      {user.identity_proof && (
                        <Image src={user.identity_proof} alt="Identity Proof" />
                      )}
                      {user.bussiness_license_number_pic && (
                        <Image src={user.bussiness_license_number_pic} alt="Business License" />
                      )}
                      {user.gst_number_pic && (
                        <Image src={user.gst_number_pic} alt="GST Document" />
                      )}
                    </div>
                  </Image.PreviewGroup>
                </div>
              </>
            ) : (
              <>
                {/* Personal Information */}
                <div className="section-divider">
                  <h4 className="section-header">
                    <User size={20} />
                    Personal Information
                  </h4>
                  <div className="info-grid">
                    <InfoCard
                      icon={Calendar}
                      label="Date of Birth"
                      value={user.dob}
                    />
                    <InfoCard
                      icon={Phone}
                      label="Other Phone"
                      value={user.other_phone_number}
                    />
                    <InfoCard
                      icon={MapPin}
                      label="Address"
                      value={user.address}
                    />
                    <InfoCard
                      icon={FileText}
                      label="SIN Code"
                      value={user.sin_code}
                    />
                    <InfoCard
                      icon={Flag}
                      label="Country Status"
                      value={user.country_status}
                    />
                    <InfoCard
                      icon={MapPin}
                      label="Current Location"
                      value={user.rider_lat && user.rider_lng ? `${user.rider_lat}, ${user.rider_lng}` : '-'}
                    />
                  </div>
                </div>

                {/* License Information */}
                <div className="section-divider">
                  <h4 className="section-header">
                    <CreditCard size={20} />
                    License Information
                  </h4>
                  <div className="info-grid">
                    <InfoCard
                      icon={CreditCard}
                      label="License Number"
                      value={user.license_number}
                    />
                    <InfoCard
                      icon={Calendar}
                      label="License Expiry Date"
                      value={user.license_expiry_date}
                    />
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="section-divider">
                  <h4 className="section-header">
                    <Bike size={20} />
                    Vehicle Information
                  </h4>
                  <div className="info-grid">
                    <InfoCard
                      icon={User}
                      label="Vehicle Owner Name"
                      value={user.vehicle_owner_name}
                    />
                    <InfoCard
                      icon={FileText}
                      label="Registration Number"
                      value={user.vehicle_registration_number}
                    />
                    <InfoCard
                      icon={Bike}
                      label="Vehicle Type"
                      value={user.vehicle_type}
                    />
                    <InfoCard
                      icon={Calendar}
                      label="Registration Expiry"
                      value={user.registraion_expiry_date}
                    />
                  </div>
                </div>

                {/* Documents & Images */}
                <div className="section-divider">
                  <h4 className="section-header">
                    <FileImage size={20} />
                    Documents & Images
                  </h4>
                  <Image.PreviewGroup>
                    <div className="image-grid">
                      {user.profile_pic && (
                        <div className="document-card">
                          <div className="card-header">
                            <User size={16} />
                            <span>Profile Picture</span>
                          </div>
                          <div className="card-image">
                            <Image src={user.profile_pic} alt="Profile Picture" />
                          </div>
                        </div>
                      )}
                      {user.identity_proof && (
                        <div className="document-card">
                          <div className="card-header">
                            <Shield size={16} />
                            <span>Identity Proof</span>
                          </div>
                          <div className="card-image">
                            <Image src={user.identity_proof} alt="Identity Proof" />
                          </div>
                        </div>
                      )}
                      {user.rider_license_image && (
                        <div className="document-card">
                          <div className="card-header">
                            <CreditCard size={16} />
                            <span>Rider License</span>
                          </div>
                          <div className="card-image">
                            <Image src={user.rider_license_image} alt="Rider License" />
                          </div>
                        </div>
                      )}
                      {user.registration_doc && (
                        <div className="document-card">
                          <div className="card-header">
                            <FileText size={16} />
                            <span>Registration Document</span>
                          </div>
                          <div className="card-image">
                            <Image src={user.registration_doc} alt="Registration Document" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Image.PreviewGroup>
                </div>
              </>
            )}
          </div>
        </div>
      </Spin>
    </>
  );
};

export default UserPreview;