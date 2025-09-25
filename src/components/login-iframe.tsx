"use client";

import { useCategoryStore } from "@/providers/category-store-provider";
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAuth } from "@/providers/auth-provider";

const LoginIframe = () => {
  const { login, setLogin } = useCategoryStore((state) => state);
  const { setUser } = useAuth();
  const handleClose = () => setLogin(false);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === "http://localhost:5000") {
        if (event.data?.type === "LOGIN_SUCCESS") {
          setUser(event.data?.user);
          setLogin(false);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setLogin]);
  return (
    <div>
      {login && (
        <Dialog onOpenChange={handleClose} open={login}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome to Ekedterra</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center">
              <iframe
                src="http://localhost:5000/fr/auth/login"
                height="500"
                width="400"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LoginIframe;
