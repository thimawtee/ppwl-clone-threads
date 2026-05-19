// import LoggedInSidebar from "../components/loggedin/LoggedInSidebar";
// import { BarChart3, Square as Instagram, MoreHorizontal, SquarePen, UserPlus, Pen } from "lucide-react";

// export default function ProfilePage() {
//   const avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"; // Ganti dengan path avatar yang sesuai

//   return (
//     <div className="min-h-screen bg-black text-white flex">
//       {/* Sidebar */}
//       <LoggedInSidebar />

//       {/* Main Content */}
//       <main className="flex-1 flex justify-center px-4 py-6">
//         <div className="w-full max-w-[620px] border border-[#262626] rounded-[24px] overflow-hidden bg-black flex flex-col">
          
//           {/* Top Bar / Header */}
//           <div className="px-6 pt-5 pb-3 flex justify-between items-center">
//             <span className="text-base font-semibold tracking-wide">virsyandr</span>
//             <button className="text-[#777777] hover:text-white transition-colors">
//               <MoreHorizontal size={22} />
//             </button>
//           </div>

//           {/* Profile Detail Info */}
//           <div className="px-6 pt-4 pb-2">
//             <div className="flex justify-between items-start">
//               {/* Left Side: Identity */}
//               <div>
//                 <h2 className="text-2xl font-bold tracking-tight text-white">vir</h2>
//                 <p className="text-sm text-[#777777] mt-0.5">virsyandr</p>
//                 <p className="text-sm text-[#777777] mt-5">0 pengikut</p>
//               </div>

//               {/* Right Side: Avatar & Social Icons */}
//               <div className="flex flex-col items-end gap-3">
//                 <img
//                   src={avatarUrl}
//                   alt="Avatar"
//                   className="w-[72px] h-[72px] rounded-full object-cover"
//                 />
//                 <div className="flex items-center gap-3 text-[#ffffff]">
//                   <button className="p-1 rounded-full hover:bg-[#121212] transition-colors">
//                     <BarChart3 size={20} className="transform rotate-90" />
//                   </button>
//                   <button className="p-1 rounded-full hover:bg-[#121212] transition-colors">
//                     <Instagram size={20} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Edit Profile Button */}
//             <button className="w-full mt-4 border border-[#262626] rounded-xl py-2 text-sm font-semibold bg-black hover:bg-[#121212] transition-colors tracking-wide">
//               Edit profil
//             </button>
//           </div>

//           {/* Navigation Tabs */}
//           <div className="flex border-b border-[#1f1f1f] mt-4 text-sm font-semibold">
//             <div className="flex-1 text-center pb-3 border-b border-white text-white cursor-pointer">
//               Threads
//             </div>
//             <div className="flex-1 text-center pb-3 text-[#777777] cursor-pointer hover:text-white transition-colors">
//               Balasan
//             </div>
//             <div className="flex-1 text-center pb-3 text-[#777777] cursor-pointer hover:text-white transition-colors">
//               Media
//             </div>
//             <div className="flex-1 text-center pb-3 text-[#777777] cursor-pointer hover:text-white transition-colors">
//               Postingan Ulang
//             </div>
//           </div>

//           {/* "Apa yang baru?" Quick Post Row */}
//           <div className="px-6 py-4 flex items-center justify-between border-b border-[#1f1f1f]">
//             <div className="flex items-center gap-3 flex-1">
//               <img
//                 src={avatarUrl}
//                 alt="Mini Avatar"
//                 className="w-9 h-9 rounded-full object-cover opacity-80"
//               />
//               <input
//                 type="text"
//                 placeholder="Apa yang baru?"
//                 className="bg-transparent text-sm text-white placeholder-[#777777] outline-none flex-1"
//               />
//             </div>
//             <button className="border border-[#262626] px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-black hover:bg-[#121212] transition-colors">
//               Kirim
//             </button>
//           </div>

//           {/* Section: Selesaikan Profil Anda */}
//           <div className="px-6 py-5">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-sm font-bold text-white">Selesaikan profil Anda</h3>
//               <span className="text-xs text-[#777777] font-medium">3 tersisa</span>
//             </div>

//             {/* Cards Grid Container */}
//             <div className="grid grid-cols-3 gap-3">
              
//               {/* Card 1: Create Thread */}
//               <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-4 flex flex-col items-center text-center justify-between min-h-[200px]">
//                 <div className="flex flex-col items-center">
//                   <div className="w-11 h-11 rounded-full border border-[#262626] flex items-center justify-center mb-3">
//                     <SquarePen size={18} className="text-white" />
//                   </div>
//                   <h4 className="text-xs font-bold text-white mb-1">Create thread</h4>
//                   <p className="text-[11px] text-[#777777] leading-normal px-1">
//                     Say what's on your mind or share a recent highlight.
//                   </p>
//                 </div>
//                 <button className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors">
//                   Create
//                 </button>
//               </div>

//               {/* Card 2: Follow 10 profiles */}
//               <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-4 flex flex-col items-center text-center justify-between min-h-[200px]">
//                 <div className="flex flex-col items-center">
//                   <div className="w-11 h-11 rounded-full border border-[#262626] flex items-center justify-center mb-3">
//                     <UserPlus size={18} className="text-white" />
//                   </div>
//                   <h4 className="text-xs font-bold text-white mb-1">Follow 10 profiles</h4>
//                   <p className="text-[11px] text-[#777777] leading-normal px-1">
//                     Fill your feed with threads that interest you.
//                   </p>
//                 </div>
//                 <button className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors">
//                   See profiles
//                 </button>
//               </div>

//               {/* Card 3: Add Bio */}
//               <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-4 flex flex-col items-center text-center justify-between min-h-[200px]">
//                 <div className="flex flex-col items-center">
//                   <div className="w-11 h-11 rounded-full border border-[#262626] flex items-center justify-center mb-3">
//                     <Pen size={16} className="text-white" />
//                   </div>
//                   <h4 className="text-xs font-bold text-white mb-1">Add bio</h4>
//                   <p className="text-[11px] text-[#777777] leading-normal px-1">
//                     Introduce yourself and tell people what you're into.
//                   </p>
//                 </div>
//                 <button className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors">
//                   Add
//                 </button>
//               </div>

//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import LoggedInSidebar from "../components/loggedin/LoggedInSidebar";
import { BarChart3, Square as Instagram, MoreHorizontal, SquarePen, UserPlus, Pen } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Mengambil data user yang disimpan oleh LoginPage di localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, []);

  // Placeholder avatar default jika avatarUrl bernilai null
  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
  const userAvatar = user?.avatarUrl || defaultAvatar;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <LoggedInSidebar />

      {/* Main Content */}
      <main className="flex-1 flex justify-center px-4 py-6">
        <div className="w-full max-w-[620px] border border-[#262626] rounded-[24px] overflow-hidden bg-black flex flex-col">
          
          {/* Top Bar / Header */}
          <div className="px-6 pt-5 pb-3 flex justify-between items-center">
            <span className="text-base font-semibold tracking-wide">
              {user?.username || "loading..."}
            </span>
            <button className="text-[#777777] hover:text-white transition-colors">
              <MoreHorizontal size={22} />
            </button>
          </div>

          {/* Profile Detail Info */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex justify-between items-start">
              {/* Left Side: Identity */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {user?.name || "Loading..."}
                </h2>
                <p className="text-sm text-[#777777] mt-0.5">
                  {user?.username ? `@${user.username}` : ""}
                </p>
                <p className="text-sm text-[#777777] mt-5">0 pengikut</p>
              </div>

              {/* Right Side: Avatar & Social Icons */}
              <div className="flex flex-col items-end gap-3">
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="w-[72px] h-[72px] rounded-full object-cover"
                />
                <div className="flex items-center gap-3 text-[#ffffff]">
                  <button className="p-1 rounded-full hover:bg-[#121212] transition-colors">
                    <BarChart3 size={20} className="transform rotate-90" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-[#121212] transition-colors">
                    <Instagram size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button className="w-full mt-4 border border-[#262626] rounded-xl py-2 text-sm font-semibold bg-black hover:bg-[#121212] transition-colors tracking-wide">
              Edit profil
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#1f1f1f] mt-4 text-sm font-semibold">
            <div className="flex-1 text-center pb-3 border-b border-white text-white cursor-pointer">
              Threads
            </div>
            <div className="flex-1 text-center pb-3 text-[#777777] cursor-pointer hover:text-white transition-colors">
              Balasan
            </div>
            <div className="flex-1 text-center pb-3 text-[#777777] cursor-pointer hover:text-white transition-colors">
              Media
            </div>
            <div className="flex-1 text-center pb-3 text-[#777777] cursor-pointer hover:text-white transition-colors">
              Postingan Ulang
            </div>
          </div>

          {/* "Apa yang baru?" Quick Post Row */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-[#1f1f1f]">
            <div className="flex items-center gap-3 flex-1">
              <img
                src={userAvatar}
                alt="Mini Avatar"
                className="w-9 h-9 rounded-full object-cover opacity-80"
              />
              <input
                type="text"
                placeholder="Apa yang baru?"
                className="bg-transparent text-sm text-white placeholder-[#777777] outline-none flex-1"
              />
            </div>
            <button className="border border-[#262626] px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-black hover:bg-[#121212] transition-colors">
              Kirim
            </button>
          </div>

          {/* Section: Selesaikan Profil Anda */}
          <div className="px-6 py-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white">Selesaikan profil Anda</h3>
              <span className="text-xs text-[#777777] font-medium">3 tersisa</span>
            </div>

            {/* Cards Grid Container */}
            <div className="grid grid-cols-3 gap-3">
              
              {/* Card 1: Create Thread */}
              <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-4 flex flex-col items-center text-center justify-between min-h-[200px]">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full border border-[#262626] flex items-center justify-center mb-3">
                    <SquarePen size={18} className="text-white" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">Create thread</h4>
                  <p className="text-[11px] text-[#777777] leading-normal px-1">
                    Say what's on your mind or share a recent highlight.
                  </p>
                </div>
                <button className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors">
                  Create
                </button>
              </div>

              {/* Card 2: Follow 10 profiles */}
              <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-4 flex flex-col items-center text-center justify-between min-h-[200px]">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full border border-[#262626] flex items-center justify-center mb-3">
                    <UserPlus size={18} className="text-white" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">Follow 10 profiles</h4>
                  <p className="text-[11px] text-[#777777] leading-normal px-1">
                    Fill your feed with threads that interest you.
                  </p>
                </div>
                <button className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors">
                  See profiles
                </button>
              </div>

              {/* Card 3: Add Bio */}
              <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-4 flex flex-col items-center text-center justify-between min-h-[200px]">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full border border-[#262626] flex items-center justify-center mb-3">
                    <Pen size={16} className="text-white" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">Add bio</h4>
                  <p className="text-[11px] text-[#777777] leading-normal px-1">
                    Introduce yourself and tell people what you're into.
                  </p>
                </div>
                <button className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors">
                  Add
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}