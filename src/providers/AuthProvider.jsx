import React, { useEffect, useState } from 'react';
import {AuthContext} from "./AuthContext"
import { createUserWithEmailAndPassword, deleteUser, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [userId,setUserId]=useState('');
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };
  const signInUser = ( email, password ) => {
    console.log(email,password);
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const createUser = (email, password ) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const updateUser = (name,photoURL)=>{
    return updateProfile(auth.currentUser,{displayName:name,photoURL:photoURL})
  }
  const logOut=()=>{
    return signOut(auth);
  }
  const deleteAccount = ()=>{
    return deleteUser(auth.currentUser);
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const userInfo = {
    user,
    userId,
    setUserId,
    setUser,
    createUser,
    signInUser,
    signInWithGoogle,
    updateUser,
    logOut,
    deleteAccount,
    loading,
    setLoading
  };
  return <AuthContext value={userInfo}>{children}</AuthContext>;
};

export default AuthProvider;