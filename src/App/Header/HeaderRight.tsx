import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'verdaccio-ui/components/Button';
import ThemeContext from 'verdaccio-ui/design-tokens/ThemeContext';

import HeaderToolTip from './HeaderToolTip';
import { RightSide } from './styles';

interface Props {
  withoutSearch?: boolean;
  username?: string;
  onToggleLogin: () => void;
  onOpenRegistryInfoDialog: () => void;
  onToggleMobileNav: () => void;
  onLogout: () => void;
}

const HeaderRight: React.FC<Props> = ({
  withoutSearch = false,
  username,
  onToggleMobileNav,
  onOpenRegistryInfoDialog,
}) => {
  const themeContext = useContext(ThemeContext);

  const { t } = useTranslation();

  if (!themeContext) {
    throw Error(t('theme-context-not-correct-used'));
  }

  /**
   * close/open popover menu for logged in users.
   */

  const handleToggleDarkLightMode = () => {
    setTimeout(() => {
      themeContext.setIsDarkMode(!themeContext.isDarkMode);
    }, 300);
  };

  return (
    <RightSide data-testid="header-right">
      {!withoutSearch && (
        <HeaderToolTip onClick={onToggleMobileNav} title={t('search.packages')} tooltipIconType={'search'} />
      )}
      <HeaderToolTip title={t('header.documentation')} tooltipIconType={'help'} />
      <HeaderToolTip onClick={onOpenRegistryInfoDialog} title={t('header.registry-info')} tooltipIconType={'info'} />
      <HeaderToolTip
        onClick={handleToggleDarkLightMode}
        title={t('header.documentation')}
        tooltipIconType={themeContext.isDarkMode ? 'dark-mode' : 'light-mode'}
      />

      {username ? (
        <Button color="inherit" onClick={() => location.href = "/account"}>
          My Account
        </Button>
      ) : (
        <Button color="inherit" data-testid="header--button-login" onClick={() => {
          localStorage.setItem("redirect", location.href);
          setTimeout(() => location.href = "/account/auth", 1000);
        }}>
          {t('button.login')}
        </Button>
      )}
    </RightSide>
  );
};

export default HeaderRight;
