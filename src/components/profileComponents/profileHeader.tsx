import { User, Edit3, X } from 'lucide-react';

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  editMode: boolean;
  loading?: boolean;
  onEdit: () => void;
  onCancel: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  firstName,
  lastName,
  email,
  editMode,
  loading = false,
  onEdit,
  onCancel,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {firstName} {lastName}
            </h1>
            <p className="text-blue-100 text-lg">{email}</p>
          </div>
        </div>
        <button
          onClick={editMode ? onCancel : onEdit}
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
  );
};