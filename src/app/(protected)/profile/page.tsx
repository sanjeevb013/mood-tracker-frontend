"use client"
import React, { useState } from 'react';
import { User, Edit3, Save, X, Mail, Phone, MapPin, Calendar } from 'lucide-react';

// TypeScript interfaces based on your API response
interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Profile: React.FC = () => {
  // Initial profile data based on your API response
  const [profile, setProfile] = useState<UserProfile>({
    _id: "68b88b0db3423a50abc0ce31",
    firstName: "rajeev",
    lastName: "Singh",
    email: "ssss@yahoo.com",
    phoneNumber: "+917878329892",
    country: "India",
    address: {
      street: "Delhi",
      city: "Delhi",
      state: "Asdas",
      zip: "111113",
      country: "India"
    },
    createdAt: "2025-09-03T18:38:05.632Z",
    updatedAt: "2025-09-06T09:10:59.373Z",
    __v: 0
  });

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEdit = (): void => {
    setEditMode(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = (): void => {
    setEditMode(false);
    setEditedProfile(profile);
  };

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile state with edited data
      setProfile(editedProfile);
      setEditMode(false);
      
      // You would typically make an API call here:
      // const response = await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editedProfile)
      // });
      
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string): void => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: keyof Address, value: string): void => {
    setEditedProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentProfile = editMode ? editedProfile : profile;

  return (
    <div className="min-h-screen py-8 px-4">
    
        {/* Header */}
        <div className=" rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {currentProfile.firstName} {currentProfile.lastName}
                  </h1>
                  <p className="text-blue-100 text-lg">{currentProfile.email}</p>
                </div>
              </div>
              <button
                onClick={editMode ? handleCancel : handleEdit}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-200 flex items-center space-x-2"
                disabled={loading}
              >
                {editMode ? (
                  <>
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Content */}
         <div className="p-8">
  <div className="grid md:grid-cols-2 gap-8">
    {/* Personal Information */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold border-b pb-2">
        Personal Information
      </h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5" />
          <div className="flex-1">
            <label className="block text-sm font-medium">First Name</label>
            {editMode ? (
              <input
                type="text"
                value={currentProfile.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              />
            ) : (
              <p className="mt-1 font-medium">{currentProfile.firstName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <User className="w-5 h-5" />
          <div className="flex-1">
            <label className="block text-sm font-medium">Last Name</label>
            {editMode ? (
              <input
                type="text"
                value={currentProfile.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              />
            ) : (
              <p className="mt-1 font-medium">{currentProfile.lastName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5" />
          <div className="flex-1">
            <label className="block text-sm font-medium">Email</label>
            {editMode ? (
              <input
                type="email"
                value={currentProfile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              />
            ) : (
              <p className="mt-1 font-medium">{currentProfile.email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5" />
          <div className="flex-1">
            <label className="block text-sm font-medium">Phone Number</label>
            {editMode ? (
              <input
                type="tel"
                value={currentProfile.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              />
            ) : (
              <p className="mt-1 font-medium">{currentProfile.phoneNumber}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5" />
          <div className="flex-1">
            <label className="block text-sm font-medium">Country</label>
            {editMode ? (
              <input
                type="text"
                value={currentProfile.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              />
            ) : (
              <p className="mt-1 font-medium">{currentProfile.country}</p>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Address Information */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold border-b pb-2">
        Address Information
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Street</label>
          {editMode ? (
            <input
              type="text"
              value={currentProfile.address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
            />
          ) : (
            <p className="mt-1 font-medium">{currentProfile.address.street}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">City</label>
            {editMode ? (
              <input
                type="text"
                value={currentProfile.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              />
            ) : (
              <p className="mt-1 font-medium">{currentProfile.address.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">State</label>
            {editMode ? (
              <input
                type="text"
                value={currentProfile.address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              />
            ) : (
              <p className="mt-1 font-medium">{currentProfile.address.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">ZIP Code</label>
            {editMode ? (
              <input
                type="text"
                value={currentProfile.address.zip}
                onChange={(e) => handleAddressChange("zip", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              />
            ) : (
              <p className="mt-1 font-medium">{currentProfile.address.zip}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Address Country</label>
            {editMode ? (
              <input
                type="text"
                value={currentProfile.address.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              />
            ) : (
              <p className="mt-1 font-medium">
                {currentProfile.address.country}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5" />
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm">{formatDate(profile.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5" />
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-sm">{formatDate(profile.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Save Button */}
  {editMode && (
    <div className="mt-8 pt-6 border-t">
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleCancel}
          className="px-6 py-3 border rounded-xl transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{loading ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </div>
  )}
</div>

        </div>
      </div>
  );
};

export default Profile;