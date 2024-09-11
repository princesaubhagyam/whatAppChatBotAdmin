import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// mui imports
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  Chip,
  useTheme,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const NavItem = ({ item, level, pathDirect, onClick, hideMenu }) => {
  // console.log(item, 'item');
  const customizer = useSelector((state) => state.customizer);
  const Icon = item.icon;
  const theme = useTheme();
  const { t } = useTranslation();
  const itemIcon =
    level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.3rem" />;
  const isActive = pathDirect.search(item.href) === 0 ? true : false;
  const ListItemStyled = styled(ListItem)(() => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    // borderRadius: `${customizer.borderRadius}px`,

    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color:
      level > 1 && isActive
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
      //borderRadius: '50%',
    },
  }));

  return (
    <>
      <List component="li" disablePadding key={item.id} sx={{ padding: '0px' }}>
        <ListItemStyled
          button
          component={item.external ? 'a' : NavLink}
          to={item.href}
          href={item.external ? item.href : ''}
          disabled={item.disabled}
          selected={isActive}
          target={item.external ? '_blank' : ''}
          onClick={onClick}
          sx={{ justifyContent: 'space-evenly', textAlign: 'center', padding: '5px 0px 0px 0px' }}
        >
          <div>
            <ListItemIcon
              sx={{
                //minWidth: '36px',
                minWidth: '0px !important',
                // p: '3px 0',
                color:
                  level > 1 && isActive ? `${theme.palette.primary.main}!important` : 'inherit',
              }}
            >
              {itemIcon}
            </ListItemIcon>
            <br />
            <ListItemText sx={{ marginTop: '-4px', fontWeight: 'bold' }}>
              <Typography variant="caption" fontSize="11px" lineHeight="0">
                <b> {hideMenu ? '' : <>{t(`${item.title}`)}</>}</b>
              </Typography>
              <br />
              {item.subtitle ? (
                <Typography
                  variant="caption"
                  fontSize="12px"
                  lineHeight="0"
                  sx={{ marginTop: '-4px' }}
                >
                  {hideMenu ? '' : item.subtitle}
                </Typography>
              ) : (
                ''
              )}
            </ListItemText>
          </div>
          {!item.chip || hideMenu ? null : (
            <Chip
              color={item.chipColor}
              variant={item.variant ? item.variant : 'filled'}
              size="small"
              label={item.chip}
            />
          )}
        </ListItemStyled>
      </List>
    </>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  hideMenu: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavItem;
