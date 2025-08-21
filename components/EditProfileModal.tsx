
import React, { useState } from 'react';
import { User } from '../types';
import Modal from './Modal';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      name,
      bio,
      location,
    });
  };
  
  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-brand-teal focus:border-brand-teal sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700";

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Your Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={labelClasses}>Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="location" className={labelClasses}>Location</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="bio" className={labelClasses}>Bio</label>
          <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} required className={inputClasses} />
        </div>
        <div className="pt-4 flex justify-end">
          <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange">
            Cancel
          </button>
          <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-teal hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
