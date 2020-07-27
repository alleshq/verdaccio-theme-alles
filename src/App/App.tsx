/* eslint-disable react/jsx-max-depth */
import styled from '@emotion/styled';
import isNil from 'lodash/isNil';
import React, { useState, useEffect, Suspense } from 'react';
import { Router } from 'react-router-dom';

import Box from 'verdaccio-ui/components/Box';
import Loading from 'verdaccio-ui/components/Loading';
import loadDayJSLocale from 'verdaccio-ui/design-tokens/load-dayjs-locale';
import StyleBaseline from 'verdaccio-ui/design-tokens/StyleBaseline';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import { isTokenExpire } from 'verdaccio-ui/utils/login';
import storage from 'verdaccio-ui/utils/storage';

import AppContextProvider from './AppContextProvider';
import AppRoute, { history } from './AppRoute';
import Header from './Header';

import '../../i18n/config';

const StyledBox = styled(Box)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor: theme?.palette.background.default,
}));

const StyledBoxContent = styled(Box)<{ theme?: Theme }>(({ theme }) => ({
  [`@media screen and (min-width: ${theme && theme.breakPoints.container}px)`]: {
    maxWidth: theme && theme.breakPoints.container,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
const App: React.FC = () => {
  const [user, setUser] = useState<undefined | { username: string }>();

  const checkUserAlreadyLoggedIn = () => {
    // checks for token validity
    const token = storage.getItem('token');
    const username = storage.getItem('username');

    if (isTokenExpire(token) || isNil(username)) {
      if (location.pathname !== "/account/auth") {
        localStorage.setItem("redirect", location.href);
        setTimeout(() => location.href = "/account/auth", 1000);
      }
      return;
    }

    setUser({ username });
  };

  useEffect(() => {
    checkUserAlreadyLoggedIn();
    loadDayJSLocale();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <StyleBaseline />
      <StyledBox display="flex" flexDirection="column" height="100%">
        <>
          <Router history={history}>
            <AppContextProvider user={user}>
              <Header />
              <StyledBoxContent flexGrow={1}>
                <AppRoute />
              </StyledBoxContent>
            </AppContextProvider>
          </Router>
        </>
      </StyledBox>
    </Suspense>
  );
};

export default App;
