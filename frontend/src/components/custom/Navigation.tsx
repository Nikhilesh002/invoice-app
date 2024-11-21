import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menubar,
  MenubarMenu
} from "@/components/ui/menubar"
import { Separator } from '@radix-ui/react-menubar';

const Navigation: React.FC = () => {
  const location = useLocation();

  // Function to check if the current link is active
  const isActive = (path: string) => location.pathname === path ? 'bg-white text-black' : 'bg-black text-white';

  return (
    <div className="w-full">
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Swipe</h1>
        <Menubar>
          <Link className={`px-3 py-2 `} to="/">
            <MenubarMenu>
              <p className={`transition-colors duration-300 ease-in-out rounded px-3 py-0.5 ${isActive('/')}`}>Home</p>
            </MenubarMenu>
          </Link>
          <Link className={`px-3 py-2 `} to="/upload-file">
            <MenubarMenu>
              <p className={`transition-colors duration-300 ease-in-out rounded px-3 py-0.5 ${isActive('/upload-file')}`}>Upload File</p>
            </MenubarMenu>
          </Link>
          <Link className={`px-3 py-2 `} to="/files">
            <MenubarMenu>
              <p className={`transition-colors duration-300 ease-in-out rounded px-3 py-0.5 ${isActive('/files')}`}>Your Files</p>
            </MenubarMenu>
          </Link>
          <Link className={`px-3 py-2 `} to="/auth/signin">
            <MenubarMenu>
              <p className={`transition-colors duration-300 ease-in-out rounded px-3 py-0.5 ${isActive('/auth/signin')}`}>SignIn</p>
            </MenubarMenu>
          </Link>
        </Menubar>
        <div className=""></div>
      </nav>
      <Separator />
    </div>
  );
};

export default Navigation;
