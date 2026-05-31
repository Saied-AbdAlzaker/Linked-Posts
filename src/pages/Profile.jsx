import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { authContext } from './../Context/AuthContext';
import { addToast } from "@heroui/toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const { token } = useContext(authContext);

  function getProfile() {
    axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: { token }
    }).then(({ data }) => {
      setUser(data.data.user);
    }).catch((error) => {
      addToast({
        title: "Error",
        description: error.reponse.data.message,
        color: "error",
      })
    })
  };

  useEffect(() => {
    getProfile();
  }, []);


  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-xl overflow-hidden my-10">

      {/* Cover */}
      <div className="h-48 bg-gray-200 relative">
        <img
          src={user.cover ? user.cover : user.photo}
          alt="cover"
          className="w-full h-full object-cover"
        />

        {/* Profile Image */}
        <div className="absolute -bottom-12 left-6">
          <img
            src={user.photo}
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
          />
        </div>
      </div>

      {/* Info */}
      <div className="pt-16 px-6 pb-6">

        {/* Name + Username */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">#{user.username}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4 text-sm text-gray-600">
          <span><strong>{user.followersCount}</strong> Followers</span>
          <span><strong>{user.followingCount}</strong> Following</span>
          <span><strong>{user.bookmarksCount}</strong> Bookmarks</span>
        </div>

        {/* Extra Info */}
        <div className="mt-4 text-sm text-gray-500 space-y-1">
          <p>📧 {user.email}</p>
          <p>🎂 {new Date(user.dateOfBirth).toLocaleDateString()}</p>
          <p>⚧ {user.gender}</p>
          <p>📅 Joined {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

      </div>
    </div>
  );
}
