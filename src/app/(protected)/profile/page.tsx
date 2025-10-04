"use client"
import React, { useEffect, useState } from 'react';
import { User, Edit3, Save, X, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import {UserProfile, Address} from "@/types/profileTypes"
import { getProfile, updateProfile } from '@/services/api/profileServices';
import { ProfileHeader } from '@/components/profileComponents/profileHeader';
import { useProfile, useUpdateProfile } from '@/hooks/features/useProfile';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
const userId = localStorage.getItem("userId") ?? "";
const { data: profile, isLoading: fetching, error } = useProfile(userId);
const { mutate, isPending } = useUpdateProfile();

  const handleEdit = (): void => {
    if (!profile) return;
    setEditMode(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = (): void => {
    setEditMode(false);
  };

 const handleSave = (): void => {
  if (!editedProfile || !userId) return;

  const { _id, createdAt, updatedAt, ...sanitizedProfile } = editedProfile;

  mutate(
    { userId, data: sanitizedProfile },
    {
      onSuccess: (updatedProfileData) => {
        setEditedProfile(updatedProfileData);
        setEditMode(false);
        toast.success("Profile updated successfully");
      },
      onError: (error) => {
        toast.error("Error updating profile:" + error);
      }
    }
  );
};


  const handleInputChange = (field: keyof UserProfile, value: string): void => {
    setEditedProfile((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  const handleAddressChange = (field: keyof Address, value: string): void => {
    setEditedProfile((prev) =>
      prev
        ? {
            ...prev,
            address: {
              ...prev.address,
              [field]: value,
            },
          }
        : prev
    );
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

   const currentProfile = editMode
    ? editedProfile
    : profile;

  
  // ⏳ Loading UI
  if (fetching || !currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
    
        {/* Header */}
        <div className=" rounded-2xl shadow-xl overflow-hidden">
          <ProfileHeader
  firstName={currentProfile.firstName}
  lastName={currentProfile.lastName}
  email={currentProfile.email}
  editMode={editMode}
  loading={loading}
  onEdit={handleEdit}
  onCancel={handleCancel}
/>

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
              <p className="text-sm">{formatDate(currentProfile.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5" />
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-sm">{formatDate(currentProfile.updatedAt)}</p>
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
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
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