import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 350,
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export default CustomTooltip;
