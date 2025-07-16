import React from "react";
import  "/src/assets/scss/pages/usermodal.scss";
import { Spin, Badge, Tag } from "antd";
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
  Image, 
  Shield, 
  Bike, 
  Flag, 
  FileImage 
} from "lucide-react";

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

  const ImagePreview = ({ src, alt, label }) => (
    <div className="image-card ">
      <div className="image-card-header">
        <Image size={16} />
        <span className="image-label">{label}</span>
      </div>
      <div className="image-container">
        <img 
          src={import.meta.env.VITE_IMAGE_BASE_URL + src}
          alt={alt}
          className="preview-image"
        />
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
                  <img
                    src={import.meta.env.VITE_IMAGE_BASE_URL + user.profile_pic}
                    alt="Profile"
                    className="avatar-image"
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
                  value={`${user.prefix} ${user.phonenumber}`}
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
                    <Image size={20} />
                    Documents & Images
                  </h4>
                  <div className="image-grid">
                    {user.store_image && (
                      <ImagePreview
                        src={user.store_image}
                        alt="Store"
                        label="Store Image"
                      />
                    )}
                    {user.identity_proof && (
                      <ImagePreview
                        src={user.identity_proof}
                        alt="Identity Proof"
                        label="Identity Proof"
                      />
                    )}
                    {user.bussiness_license_number_pic && (
                      <ImagePreview
                        src={user.bussiness_license_number_pic}
                        alt="Business License"
                        label="Business License Document"
                      />
                    )}
                    {user.gst_number_pic && (
                      <ImagePreview
                        src={user.gst_number_pic}
                        alt="GST Document"
                        label="GST Document"
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Rider Information */}
                <div className="section-divider">
                  <h4 className="section-header">
                    <Bike size={20} />
                    Rider Information
                  </h4>
                  <div className="info-grid">
                    <InfoCard
                      icon={FileText}
                      label="SIN Code"
                      value={user.sin_code}
                    />
                    <InfoCard
                      icon={CreditCard}
                      label="License Number"
                      value={user.license_number}
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

                {/* Documents */}
                <div className="section-divider">
                  <h4 className="section-header">
                    <FileImage size={20} />
                    Documents
                  </h4>
                  <div className="image-grid">
                    {user.identity_proof && (
                      <ImagePreview
                        src={user.identity_proof}
                        alt="Identity Proof"
                        label="Identity Proof"
                      />
                    )}
                  </div>
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