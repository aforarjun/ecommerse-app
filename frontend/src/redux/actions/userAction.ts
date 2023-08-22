import { axiosInstance } from '../../server';
import { AppDispatch } from '../store';

import {
  // login/signup user
  SIGN_USER_REQUEST,
  SIGN_USER_SUCCESS,
  SIGN_USER_FAIL,

  // Load User
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,

  // update user info
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL
} from '../constant/userConstant';

// Login user
export const loginUser =
  ({ email, password }: { email: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: SIGN_USER_REQUEST
      });

      const { data } = await axiosInstance.post(
        '/user/login-user',
        { email, password },
        { withCredentials: true }
      );

      dispatch({
        type: SIGN_USER_SUCCESS,
        payload: data
      });
    } catch (error: any) {
      dispatch({
        type: SIGN_USER_FAIL,
        payload: error.response.data.message
      });
    }
  };

// activate user
export const activateUser = (tokenData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch({
      type: SIGN_USER_REQUEST
    });

    const { data } = await axiosInstance.post('/user/verify-user', tokenData);

    dispatch({
      type: SIGN_USER_SUCCESS,
      payload: data.user
    });
  } catch (error: any) {
    dispatch({
      type: SIGN_USER_FAIL,
      payload: error.response.data.message
    });
  }
};

// load user
export const loadUser = () => async (dispatch: AppDispatch) => {
  try {
    dispatch({
      type: LOAD_USER_REQUEST
    });

    const { data } = await axiosInstance.get('/user/load-user', {
      withCredentials: true
    });

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data.user
    });
  } catch (error: any) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response.data.message
    });
  }
};

// Update user
export const updateUser =
  ({
    name,
    email,
    phoneNumber,
    password
  }: {
    name: string;
    email: string;
    phoneNumber: number;
    password: string;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: UPDATE_USER_REQUEST
      });

      const { data } = await axiosInstance.put(
        '/user/update-user',
        {
          name,
          email,
          phoneNumber,
          password
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Credentials': true
          }
        }
      );

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: data.user
      });
    } catch (error: any) {
      dispatch({
        type: UPDATE_USER_FAIL,
        payload: error.response.data.message
      });
    }
  };
