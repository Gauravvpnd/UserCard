import React, { useEffect, useState } from 'react';

export type User = {
  profilePicture: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
};

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async (page: number): Promise<User[]> => {
    try {
      const response = await fetch(`https://randomuser.me/api/?page=${page}&results=10`);
      const data = await response.json();

      const transformedUsers: User[] = data.results.map((result: any) => ({
        profilePicture: result.picture.large,
        firstName: result.name.first,
        lastName: result.name.last,
        email: result.email,
        dob: result.dob.date,
        phone: result.phone,
        address: {
          street: result.location.street.name,
          city: result.location.city,
          state: result.location.state,
          postalCode: result.location.postcode,
        },
      }));

      setUsers(transformedUsers);
      return transformedUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleCardClick = (user: User) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User List</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => handleCardClick(user)}
          >
            <img
              className="w-full h-40 object-cover object-center"
              src={user.profilePicture}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <div className="p-4">
              <p className="text-xl font-bold mb-2">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleCardClick(user)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col mt-4">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-75" onClick={closeModal}></div>
          <div className="bg-white p-6 rounded-lg z-10 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              {selectedUser.firstName} {selectedUser.lastName}
            </h2>
            <p>
              <strong>Date of Birth:</strong> {selectedUser.dob}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedUser.phone}
            </p>
            <p>
              <strong>Address:</strong>{' '}
              {`${selectedUser.address.street}, ${selectedUser.address.city}, ${selectedUser.address.state}, ${selectedUser.address.postalCode}`}
            </p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
