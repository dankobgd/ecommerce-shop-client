import React from 'react';

import { Box, Card, CardContent, Container, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useQuery, useQueryCache } from 'react-query';

import api from '../../../api';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },

  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const a11yProps = index => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

function PreviewProduct({ productId }) {
  const classes = useStyles();
  const cache = useQueryCache();

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { data: product } = useQuery(['products', productId], () => api.products.get(productId), {
    initialData: () => cache.getQueryData('products')?.data?.find(x => x.id === productId),
  });
  const { data: tags } = useQuery(['products', productId, 'tags'], () => api.products.getTags(productId), {
    initialData: () => cache.getQueryData(['products', productId, 'tags']),
  });
  const { data: images } = useQuery(['products', productId, 'images'], () => api.products.getImages(productId), {
    initialData: () => cache.getQueryData(['products', productId, 'images']),
  });
  const { data: reviews } = useQuery(['products', productId, 'reviews'], () => api.products.getReviews(productId), {
    initialData: () => cache.getQueryData(['products', productId, 'reviews']),
  });

  const { category, brand, ...productData } = product ?? {};

  return (
    <Container component='main' maxWidth='md'>
      <Card className={classes.root} variant='outlined'>
        <div className={classes.tabs}>
          <div>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='product view and relations tabs'
              variant='fullWidth'
            >
              <Tab label='Product' {...a11yProps(0)} />
              <Tab label='Category' {...a11yProps(1)} />
              <Tab label='Brand' {...a11yProps(2)} />
              <Tab label='Tags' {...a11yProps(3)} />
              <Tab label='Images' {...a11yProps(4)} />
              <Tab label='Reviews' {...a11yProps(5)} />
            </Tabs>
          </div>
          <CardContent>
            <TabPanel value={value} index={0}>
              <pre>{JSON.stringify(productData, null, 2)}</pre>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <pre>{JSON.stringify(category, null, 2)}</pre>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <pre>{JSON.stringify(brand, null, 2)}</pre>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <pre>{JSON.stringify(tags, null, 2)}</pre>
            </TabPanel>
            <TabPanel value={value} index={4}>
              <pre>{JSON.stringify(images, null, 2)}</pre>
            </TabPanel>
            <TabPanel value={value} index={5}>
              <pre>{JSON.stringify(reviews, null, 2)}</pre>
            </TabPanel>
          </CardContent>
        </div>
      </Card>
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default PreviewProduct;
