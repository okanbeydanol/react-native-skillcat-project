import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {USER} from '../../constants/typescript/general-types';
import {BASE_API_URL, BASE_URL} from '../../constants';
import {getData} from '../../utils/async-storage';

export const getUserTokenFromStorage = async () => {
  try {
    return await getData('s[userToken]');
  } catch (e) {
    return null;
  }
};

export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  {error: string}
> = async (args, api, extraOptions) => {
  const {url, method, body} = args as FetchArgs;

  let patchedBody = {...body};
  const params = new URLSearchParams({});
  const isApiUrl = url.includes('token.php');
  const isAjaxUrl = url.includes('service-nologin.php');
  console.log('url: ', url);
  console.log('patchedBody: ', patchedBody);
  console.log('isApiUrl: ', isApiUrl);
  if (!isApiUrl && !isAjaxUrl) {
    const token = await getUserTokenFromStorage();
    if (!token) {
      return {error: 'Token not found'};
    }
    params.append('wstoken', token);
    params.append('moodlewsrestformat', 'json');
    params.append('moodlewssettingfilter', 'true');
    params.append('moodlewssettingfileurl', 'true');
    params.append('wsfunction', url);
  } else if (isAjaxUrl) {
    if (!patchedBody) {
      return {error: 'Body not found'};
    }
    patchedBody = JSON.stringify([
      {
        index: 0,
        methodname: url.split('?info=')[1],
        args: body,
      },
    ]);
  } else {
    if (!patchedBody) {
      return {error: 'Body not found'};
    }
    if (!patchedBody.username || !patchedBody.password) {
      return {error: 'Username or password not found'};
    }
    params.append('username', patchedBody.username);
    params.append('password', patchedBody.password);
    // params.append('username', 'kenyan@okan.epa');
    // params.append('password', 'Test1234');
    params.append('service', 'moodle_mobile_app');
  }
  const finalUrl =
    !isApiUrl && !isAjaxUrl
      ? `${BASE_API_URL}?${params.toString()}`
      : !isAjaxUrl
      ? `${BASE_URL}${url}?${params.toString()}`
      : `${BASE_URL}${url}`;
  console.log('params: ', params);
  console.log('finalUrl: ', finalUrl);

  const result = await fetchBaseQuery({baseUrl: BASE_URL})(
    {
      url: finalUrl,
      method,
      body: patchedBody,
      timeout: 60000,
    },
    api,
    extraOptions,
  );
  console.log('result: ', result);

  if (result.error) {
    console.log('err1: ', {error: result.error.toString()});

    return {error: result.error.toString()};
  }
  const responseData = result.data as
    | Record<string, unknown>
    | Array<Record<string, unknown>>;

  if (Array.isArray(responseData)) {
    for (const item of responseData) {
      if (item.exception) {
        const exception = item.exception as Record<string, unknown>;
        return {error: exception.message || exception.error || 'Unknown error'};
      }
    }
  } else if (
    (responseData && 'errorcode' in responseData) ||
    'exception' in responseData
  ) {
    return {
      error:
        (responseData as any).message ||
        (responseData as any).error ||
        'Unknown error',
    };
  }

  return {data: responseData};
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customBaseQuery,
  endpoints: build => ({
    getToken: build.query<USER, any>({
      query: patch => ({
        url: 'local/skillcat/pages/token.php',
        method: 'POST',
        body: patch,
      }),
    }),
    getAppVersion: build.query<any, any>({
      query: patch => ({
        url: 'local_skillcat_get_app_version',
        method: 'POST',
        body: patch,
      }),
    }),
    signUpWithOauth: build.query<any, any>({
      query: patch => ({
        url: 'lib/ajax/service-nologin.php?info=local_skillcat_oauth',
        method: 'POST',
        body: patch,
      }),
    }),
    signUpWithEmail: build.query<any, any>({
      query: patch => ({
        url: 'lib/ajax/service-nologin.php?info=local_skillcat_signup_user_v2',
        method: 'POST',
        body: patch,
      }),
    }),
    checkEmail: build.query<any, any>({
      query: patch => ({
        url: 'lib/ajax/service-nologin.php?info=local_skillcat_check_email',
        method: 'POST',
        body: patch,
      }),
    }),
    checkNumberVerification: build.query<any, any>({
      query: patch => ({
        url: 'lib/ajax/service-nologin.php?info=local_skillcat_mobile_number_verification_v4',
        method: 'POST',
        body: patch,
      }),
    }),
    checkNumberConfirmation: build.query<any, any>({
      query: patch => ({
        url: 'lib/ajax/service-nologin.php?info=local_skillcat_mobile_number_confirmation_v3',
        method: 'POST',
        body: patch,
      }),
    }),
    requestPasswordReset: build.query<any, any>({
      query: patch => ({
        url: 'lib/ajax/service-nologin.php?info=local_skillcat_request_password_reset_v2',
        method: 'POST',
        body: patch,
      }),
    }),
    validatePasswordResetToken: build.query<any, any>({
      query: patch => ({
        url: 'lib/ajax/service-nologin.php?info=local_skillcat_check_password_reset_token',
        method: 'POST',
        body: patch,
      }),
    }),
    resetUserPassword: build.query<any, any>({
      query: patch => ({
        url: 'lib/ajax/service-nologin.php?info=local_skillcat_reset_user_password',
        method: 'POST',
        body: patch,
      }),
    }),
  }),
});

export const {
  useLazyGetTokenQuery,
  useLazyGetAppVersionQuery,
  useLazyCheckEmailQuery,
  useLazyCheckNumberVerificationQuery,
  useLazyCheckNumberConfirmationQuery,
  useLazyRequestPasswordResetQuery,
  useLazyValidatePasswordResetTokenQuery,
  useLazyResetUserPasswordQuery,
  useLazySignUpWithOauthQuery,
  useLazySignUpWithEmailQuery,
} = userApi;
