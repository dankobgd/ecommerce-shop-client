import React, { useState } from 'react';

import { Select, MenuItem, ListItemText, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';

import engFlag from '../../assets/img/eng_flag.png';
import srbFlag from '../../assets/img/srb_flag.png';

const useStyles = makeStyles(theme => ({
  form: {
    marginRight: '1rem',
  },
  formControl: {
    minWidth: 120,
  },
  select: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(0),
  },
  langIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: theme.spacing(2),
  },
  langText: {
    color: props => (props.switcherOpened ? theme.palette.black : theme.palette.white),
    marginRight: theme.spacing(4),
  },
}));

export default function SimpleSelect() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [switcherOpened, setSwitcherOpened] = useState(false);
  const classes = useStyles({ switcherOpened });

  const languages = [
    { code: 'en-US', short: 'ENG', label: 'English', flag: engFlag },
    { code: 'sr-RS', short: 'SRB', label: 'Srpski', flag: srbFlag },
  ];

  const handleChange = e => {
    i18n.changeLanguage(e.target.value);
    setLang(e.target.value);
  };

  return (
    <form autoComplete='off' className={classes.form}>
      <FormControl className={classes.formControl} variant='filled'>
        <Select
          classes={{ select: classes.select }}
          value={lang}
          onChange={handleChange}
          inputProps={{ lang }}
          disableUnderline
          onOpen={() => setSwitcherOpened(true)}
          onClose={() => setSwitcherOpened(false)}
        >
          {languages.map(({ code, label, flag }) => (
            <MenuItem key={code} value={code}>
              <div className={classes.langIcon}>
                <img src={flag} alt={`${label} flag`} width={36} />
              </div>
              <ListItemText primary={label} classes={{ primary: classes.langText }} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  );
}
