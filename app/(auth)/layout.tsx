import React, { ReactNode } from "react";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[85vh] flex justify-center items-center">
      {children}
    </div>
  );
}

export default AuthLayout;
